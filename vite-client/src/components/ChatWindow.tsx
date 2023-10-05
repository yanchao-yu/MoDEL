import * as React from 'react';
import {useRef, useEffect, useState, useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatWindowInterface } from '../interfaces';
import Bot from '../svgs/bot.svg';
import stop_speech from '../svgs/microphone-muted-button-red-icon.png';
import start_speech from '../svgs/microphone-button-green-icon.png';
import { postData } from '../utils';
import 'regenerator-runtime/runtime'
import { DataContext } from '../app/store';
import xtype from 'xtypejs'
import useSpeechToText from 'react-hook-speech-to-text';
import { conversations } from '../chats';
import { Button, Form, InputGroup } from "react-bootstrap";
import { useSpeechSynthesis } from "react-speech-kit";


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

    const { speak } = useSpeechSynthesis()

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
                    if (enableVoice){speak({ text: response })};
                }
            })
            .catch((err) => console.log(err));
    }

    const handleKeyPress = async (text: string) => {
        if (text=="/start"){
            clearContext()
        }
        else{
            query(text);
            setUserQuery('')
        }
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
                if (enableVoice){speak({ text: botResponse });}
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
                {chats?.map((item: { speaker: string; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
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

               {enableVoice ? (
                   <div className="ms-3">
                       <Button  onClick={isRecording ? stopSpeechToText : startSpeechToText} variant="outline-secondary" style={{ 'paddingTop': 0, 'paddingBottom': 0, 'paddingLeft': 0, 'paddingRight': 0 , 'backgroundColor':'transparent'}}>
                           {isRecording ? <img src={stop_speech} style={{height:40, width:40, alignItems: 'center', justifyContent: 'center'}} />
                               : <img src={start_speech} style={{height:40, width:40, alignItems: 'center', justifyContent: 'center'}} />}
                       </Button>
                   </div>
               ) :
                   <InputGroup className="mb-2 text-center">
                       <Form.Control
                           as="textarea"
                           rows={1}
                           placeholder="Type your message"
                           value={userQuery}
                           onChange={(e: any) => setUserQuery(e.target.value)}
                       />
                       <Button variant="outline-secondary" onClick={() => handleKeyPress(userQuery)}>Send</Button>
                   </InputGroup>
               }
            </div>
        </div>
    );
}
