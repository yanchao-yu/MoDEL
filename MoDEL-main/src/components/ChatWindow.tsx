import * as React from 'react';
import {useRef, useEffect, useState, useCallback} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatWindowInterface } from '../interfaces';
import Bot from '../svgs/bot.svg';
import { postData } from '../utils/';
import classNames from "classnames";
import 'regenerator-runtime/runtime'
import Speech from "speak-tts";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";


export default function ChatWindow({
  title,
  botIcon = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
  serverURL,
  session_id,
  chats,
  enableVoice,
  updateChats,
  width = 300,
  height = 400,
}: ChatWindowInterface) {

  const [isListening, setListening] = useState(false);
  const [botResponse, setBotResponse] = useState('');

  // const appId = '8b12e1fc-7544-46bb-a619-10a9cc77dc2d';
  // const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
  // SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

    const {finalTranscript, resetTranscript } = useSpeechRecognition();
    useEffect(() => {
        if (finalTranscript !== '') {
            updateChats([...chats, { text: finalTranscript, speaker: 'user' }]);
            // alanaQuery(finalTranscript);
            // Create a fresh transcript to avoid the same transcript being appended multiple times
            resetTranscript();
        }
    }, [finalTranscript, resetTranscript]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-GB',
        });
    };
    const switchBtn = () => {
        setListening(isListening => !isListening);

        if (isListening) {
            SpeechRecognition.stopListening();
        }
        else {
            listenContinuously();
        }
    }

  var btnClass = classNames({
    'is-mic-button': true,
    'is-listening': isListening,
  });

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

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      updateChats([...chats, { text: e.currentTarget.value, speaker: 'user' }]);
      postData(serverURL || 'https://kpfm2b.sse.codesandbox.io', {
        session_id,
        user_id: uuidv4(),
        text: e.currentTarget.value,
      })
        .then(async (data) => {
          if (data) {
            const {
              nlu: { response },
            } = data;
            setBotResponse(response);
          }
        })
        .catch((err) => console.log(err));
      e.currentTarget.value = '';
    }
  };

  useEffect(() => {
    if (botResponse) {
      updateChats([...chats, { text: '...', speaker: 'bot' }]);
      setTimeout(() => {
        updateChats([...chats, { text: botResponse, speaker: 'bot' }]);
        if (enableVoice) {speak(botResponse)}
      }, 1000);
    }
  }, [botResponse]);

  // START -> Autoscroll Chats Window
  const AutoScrollConversations = () => {
    const containerRef = useRef();
    useEffect(() => containerRef.current.scrollIntoView());
    return <div style={{ width: 350 }} ref={containerRef} />;
  };

  // Autoscroll Chats Window -> END!
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
      <div className="chat-box-container">
        <input
          className="chat-box"
          placeholder="Type your message"
          onKeyPress={handleKeyPress}
        />
        {enableVoice ? (<button onClick={switchBtn}>🎙️</button>) : null}
      </div>
    </div>
  );
}