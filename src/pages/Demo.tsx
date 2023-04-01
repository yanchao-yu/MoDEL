import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import useFetchDemoData from '../hooks/useFetchDemoData';
import Modal from '../components/Modal';
import BugReport from '../components/BugReport';
import { generateID } from '../utils';
import Webcam from "react-webcam";

export default function Demo() {
  const { botId, template } = useParams();
  const { loading, activeBot } = useFetchDemoData(botId);
  const [start, setStart] = useState(false);
  const [chats, updateChats] = useState<{text: string, speaker: string}[]>([]);
  const [showBot, toggleBot] = useState(true);
  const [showBugModal, setShowBugModal] = useState(false);

  console.log("activeBot: " + activeBot)

  function descriptionMarkup() {
    return { __html: activeBot.description };
  }

  function consentMarkup() {
    return { __html: activeBot.consentNote };
  }

  function displayAreaMarkup() {
    return { __html: activeBot.displayContent };
  }
  function botIframe() {
    return { __html: activeBot.embedCode };
  }

  const handleBugReport = () => {
    setShowBugModal(true);
  };

  const [session_id, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(generateID());
  }, []);

  useEffect(() => {
    if (activeBot !== undefined) {
      updateChats([
        {
          text: activeBot.botIntro === '' ? 'Hello' : activeBot?.botIntro,
          speaker: 'bot',
        },
      ]);
    }
  }, [activeBot]);

  const webcamRef = React.useRef(null);
  const WebcamCapture = async () => {
    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();},
        [webcamRef]
    );
  };

  return (
    <div>
      {showBugModal ? (
        <Modal
          close={() => setShowBugModal(false)}
          title="🐛 Bug Report"
          description="Please use this form to report individual bugs you find e.g. strange, unexpected responses, error messages etc. Please submit a separate form for each bug you find"
        >
          <BugReport session_id={session_id} />
        </Modal>
      ) : null}
      {loading ? (
        <p>loading...</p>
      ) : (
        <div className="preview-container no-shadow">
          <div style={{ textAlign: 'center' }}>
            <h2>{activeBot.title}</h2>
            <p style={{ marginTop: 5 }}>
              <div
                  dangerouslySetInnerHTML={descriptionMarkup()}
              />
            </p>
            <p style={{ marginTop: 10 }}>
              <strong style={{ color: 'red' }}>
                CONSENT: Please read the consent below before you continue
              </strong>
            </p>
            <div className="input-div">
              <input
                id="consent"
                type="checkbox"
                onChange={(e) => setStart(e.target.checked)}
              />{' '}
              <div
                  dangerouslySetInnerHTML={consentMarkup()}
              />
            </div>
          </div>
          <div className="divider"></div>
          {start ? (
            <div
              className="preview"
              style={{
                position: 'relative',
                flexDirection:
                  template === 'chat-content-right' ? 'row-reverse' : 'row',
              }}
            >
              {template === 'chat-content-background' &&
              activeBot.developmentPlatform !== '' ? (
                <button
                  className="button slategrey"
                  style={{ position: 'absolute', bottom: -40, right: 20 }}
                  onClick={() => toggleBot(!showBot)}
                >
                  {showBot ? 'X' : '+'}
                </button>
              ) : null}

              {template !== 'chat-only' ? (
                  <div>
                    <div
                        className={`display-area ${
                            template !== 'chat-only' ? 'full-width' : ''
                        }`}
                        dangerouslySetInnerHTML={displayAreaMarkup()}
                    />

                    {template == 'chat-content-webcam' ? (
                        <div>
                          <Webcam
                              audio={false}
                              height="100%"
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              width="100%"
                              videoConstraints={{deviceId: activeBot.webcamId}}
                          />
                        </div>
                    ): null}
                  </div>
              ) : null}
              {activeBot.developmentPlatform === 'custom-server' ? (
                <div
                  className={
                    template === 'chat-content-background'
                      ? 'bot-area floating'
                      : 'bot-area'
                  }
                >
                  {showBot ? (
                    <ChatWindow
                      title={activeBot.botName}
                      botIcon={activeBot.botIcon}
                      serverURL={activeBot.serverURL}
                      session_id={session_id}
                      userInputObj={activeBot.userInputObj}
                      userinputKey={activeBot.userinputKey}
                      sysoutputKey={activeBot.sysoutputKey}
                      chats={chats}
                      updateChats={updateChats}
                      width={template === 'chat-only' ? 730 : 350}
                    />
                  ) : null}
                </div>
              ) : (
                <div
                  className={`bot-area ${
                    template === 'chat-only'
                      ? 'full-iframe'
                      : template === 'chat-content-background'
                      ? 'bot-area floating'
                      : ''
                  }`}
                  dangerouslySetInnerHTML={showBot ? botIframe() : null}
                />
              )}
            </div>
          ) : (
            <p className="text-center">"Read and agree the consent first"</p>
          )}
          {start ? (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {activeBot.enableBugReport ? (
                <button
                  onClick={handleBugReport}
                  className="button bug-report-btn"
                >
                  🐛 Bug Report
                </button>
              ) : null}
              {activeBot.enableFeedback ? (
                <a
                  href={activeBot.feedbackLink}
                  target="_blank"
                  className="button feedback-btn"
                  style={{ marginLeft: 10 }}
                >
                  Share Overall Feedback 🙂
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
