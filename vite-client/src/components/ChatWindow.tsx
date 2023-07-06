import * as React from 'react';
import {useRef, useEffect, useState, useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatWindowInterface } from '../interfaces';
import Bot from '../svgs/bot.svg';
import stop_speech from '../svgs/microphone-muted-button-red-icon.png';
import start_speech from '../svgs/microphone-button-green-icon.png';
import { postData } from '../utils';
import 'regenerator-runtime/runtime'
import Speech from "speak-tts";
import { DataContext } from '../app/store';
import xtype from 'xtypejs'
import useSpeechToText from 'react-hook-speech-to-text';
import { conversations } from '../chats';
import { Button, Form, Input, InputGroup } from "react-bootstrap";

export default function ChatWindow({
                                       title,
                                       botIcon = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                                       serverURL,
                                       session_id,
                                       userInputObj,
                                       userinputKey,
                                       sysoutputKey,
                                       enableVoice,
                                       getDialogueLog,
                                       width = 300,
                                       height = 400,
                                   }: ChatWindowInterface) {

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: false,
        crossBrowser: true,
        googleCloudRecognitionConfig: {
            languageCode: 'en-US'
        },
        googleApiKey: "AIzaSyAtHeCifoPmvbYtQAAJ1D4bZn_DQIq3mRE",
        useLegacyResults: false
    });
    const [numUtt, setNumUtt] = useState(0);
    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    const [userQuery, setUserQuery] = useState('');
    const [botResponse, setBotResponse] = useState('');
    const {chats, updateChats }= useContext(DataContext)

    const clearContext = () =>{
        updateChats(conversations);
    }

    useEffect(() => {
        console.log(results.length)
        console.log(numUtt)
        if (results.length > numUtt) {
            let transcipt_obj = results.slice(-1)[0];
            console.log("results.slice(-1): " + JSON.stringify(transcipt_obj));
            let final_transcipt = transcipt_obj.transcript;
            console.log("final_transcipt: " + final_transcipt);

            updateChats([...chats, { text: final_transcipt, speaker: 'user' }]);
            if (getDialogueLog) {getDialogueLog(chats);}
            query(final_transcipt);
            setNumUtt(numUtt+1)
        }
    }, [results]);

    // Text-to-Speech function
    const speech = new Speech();
    speech.init({
        volume: 0.5,
        lang: "en-GB",
        rate: 1,
        pitch: 1,
        'voice':'Google UK English Female',
        'splitSentences': true,
    })
        .then((data: any) => {
            console.log("Speech is ready", data);
        })
        .catch((e: any) => {
            console.error("An error occured while initializing : ", e);
        });

    if (!speech.hasBrowserSupport()){
        alert("Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !");
    }

    const speak = (utt: string) => {
        speech.speak({
            text: utt,
            queue: false,
            listeners: {
                onstart: () => {
                    console.log("Start utterance");
                },
                onend: () => {
                    console.log("End utterance");
                },
                onresume: () => {
                    console.log("Resume utterance");
                },
                onboundary: event => {
                    console.log(
                        event.name +
                        " boundary reached after " +
                        event.elapsedTime +
                        " milliseconds."
                    );
                }
            }
        })
            .then((data: any) => {
                console.log("Success !", data);
            })
            .catch((e: any) => {
                console.error("An error occurred :", e);
            });
    }

    function query(user_input: string) {
        let shallow = Object.assign({}, userInputObj);
        shallow["session_id"] = session_id
        shallow["user_id"] = uuidv4()
        shallow["speaker"] = 'user'
        shallow[userinputKey] = user_input
        console.log('query_object: ' + JSON.stringify(shallow))
        updateChats([...chats, {text: user_input, speaker: 'user'}]);
        if (getDialogueLog) {
            getDialogueLog(chats);
        }
        postData(serverURL || `${import.meta.env.REACT_APP_SERVER_URL}/v1`, shallow)
            .then(async (data) => {
                const response = getResponse(data);
                if(enableVoice) {
                    setBotResponse(response);
                    speak(response);
                }
            })
            .catch((err) => console.log(err));
    }

    const handleKeyPress = async (text: string) => {
        query(text);
        // setUserQuery('');
    };

    const getResponse = (data: any) => {
        const data_type = xtype(data)
        if (data_type === 'single_elem_array' || data_type === 'multi_elem_array'){
            return data.map((item: any, index: number ) => {
                const keys = sysoutputKey.split('.');

                let temp_data = Object.assign({}, item);
                let response = "";
                keys.forEach(
                    function (k: any) {
                        temp_data = temp_data[k]
                        const tmp_data_type = xtype(temp_data)
                        if (tmp_data_type === "multi_char_string" || tmp_data_type === 'empty_string' || tmp_data_type === "whitespace" || tmp_data_type === "multi_elem_array") {
                            response = temp_data
                        }
                    });
                return response;
            });
        }
        else if ( data_type ===  "single_prop_object" || data_type === 'multi_prop_object'){
            const keys = sysoutputKey.split('.');
            let temp_data = Object.assign({}, data);
            let response = "";
            keys.forEach(
                function(k: any){
                    temp_data = temp_data[k]
                    const tmp_data_type = xtype(temp_data)
                    if ( tmp_data_type ===  "multi_char_string" || tmp_data_type === 'empty_string' || tmp_data_type === "whitespace"){
                        response = temp_data
                    }
                });

            alert(JSON.stringify(response))
            alert(response)
            return response;
        }
    };

    useEffect(() => {
        if (botResponse) {
            updateChats([...chats, { text: '...', speaker: 'bot' }]);
            if (getDialogueLog) {getDialogueLog(chats);}
            setTimeout(() => {
                updateChats([...chats, { text: botResponse, speaker: 'bot' }]);
                if (getDialogueLog) {getDialogueLog(chats);}
                if (enableVoice) {speak(botResponse)}
            }, 1000);
        }
    }, [botResponse]);


    console.log({chats});
    // START -> Autoscroll Chats Window
    const AutoScrollConversations = () => {
        const containerRef = useRef();
        useEffect(() => containerRef.current.scrollIntoView());
        return <div style={{ width: "85%" }} ref={containerRef} />;
    };

    // Autoscroll Chats Window -> END!
    // @ts-ignore
    return (
        <div className="chat-container" style={{ width }}>
            <div className="bot-information text-center">
                <h3>
                    <img src={Bot} width={20} /> {title}
                </h3>
            </div>

            <div id="chat-window" style={{ height }}>
                {chats?.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            borderRadius: 20,
                            margin: '5px 15px',
                            textAlign: 'left',
                            position: 'relative',
                            alignSelf: item.speaker === 'bot' ? 'start' : 'end',
                        }}
                    >
            <span style={{ display: 'inline-block', marginRight: 5 }}>
              {item.speaker === 'bot' ? (
                  <img
                      src={
                          botIcon === ''
                              ? 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
                              : botIcon
                      }
                      width={25}
                  />
              ) : null}
            </span>
                        <span
                            style={{
                                background: item.speaker === 'bot' ? 'aliceblue' : '#f2f2f1',
                                padding: 8,
                                display: 'inline-block',
                                maxWidth: 220,
                                borderRadius:
                                    item.speaker === 'bot'
                                        ? '2px 12px 12px 12px'
                                        : '12px 2px 12px 12px',
                            }}
                        >
              {item.text}
            </span>
                    </div>
                ))}
                <AutoScrollConversations />
            </div>

           <div className="gap-3" style={{'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center', 'alignSelf': 'stretch'}}>

               {/*<div className="m-3">*/}
               {/*    <Form>*/}
               {/*        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">*/}
               {/*            <Form.Label>Example textarea</Form.Label>*/}
               {/*            <Form.Control*/}
               {/*                as="textarea"*/}
               {/*                rows={3}*/}
               {/*                value={userQuery}*/}
               {/*                onChange={onChange}*/}
               {/*            />*/}
               {/*        </Form.Group>*/}
               {/*    </Form>*/}

               {/*    <Button*/}
               {/*        variant="outline-primary"*/}
               {/*        size="lg"*/}
               {/*        active*/}
               {/*        onClick={() => handleKeyPress(userQuery)}*/}
               {/*    >*/}
               {/*        Wave at Me*/}
               {/*    </Button>*/}
               {/*</div>*/}

                {/*<input*/}
                {/*    className="chat-box"*/}
                {/*    placeholder="Type your message"*/}
                {/*    style={{'backgroundColor':'transparent'}}*/}
                {/*    onKeyPress={handleKeyPress}*/}
                {/*/>*/}
               <InputGroup className="mb-2">
                   <Form.Control
                       as="textarea"
                       rows={1}
                       placeholder="Type your message"
                       onChange={(e: any) => setUserQuery(e.target.value)}
                   />
                   <Button variant="outline-secondary" onClick={() => handleKeyPress(userQuery)}>Send</Button>
               </InputGroup>
                {enableVoice ? (
                    <div className="ms-3">
                        <Button  onClick={isRecording ? stopSpeechToText : startSpeechToText} variant="outline-secondary" style={{ 'paddingTop': 0, 'paddingBottom': 0, 'paddingLeft': 0, 'paddingRight': 0 , 'backgroundColor':'transparent'}}>
                            {isRecording ? <img src={stop_speech} style={{height:40, width:40, alignItems: 'center', justifyContent: 'center'}} />
                                : <img src={start_speech} style={{height:40, width:40, alignItems: 'center', justifyContent: 'center'}} />}
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
