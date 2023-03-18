import * as React from 'react';
import { useState, useEffect } from 'react';
import useClipboard from 'react-use-clipboard';
import { Link, useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import Modal from '../components/Modal';
import BugReport from '../components/BugReport';
import WebCamera from "../components/WebCamera";
import { generateID } from '../utils';
import Darkmode from 'drkmd-js'

export default function TemplatePreview() {
  const template = useParams();
  const {
    botId,
    title,
    description,
    embedCode,
    developmentPlatform,
    botName,
    botIntro,
    botIcon,
    serverURL,
    consentNote,
    enableBugReport,
    enableFeedback,
    enableVoice,
    webcamId,
    feedbackLink,
    displayContent,
  } = JSON.parse(window.localStorage.getItem('obj'));
  function displayAreaMarkup() {
    return { __html: displayContent };
  }

  function botIframe() {
    return { __html: embedCode };
  }

  const [start, setStart] = useState(false);
  const [chats, updateChats] = useState([
    { text: botIntro === '' ? 'Hello' : botIntro, speaker: 'bot' },
  ]);
  const [showBot, toggleBot] = useState(true);

  const [isCopied, setCopied] = useClipboard(
    `${import.meta.env.VITE_BASE_URL}/demo/${template.template}/${botId}`
  );

  const [showBugModal, setShowBugModal] = useState(false);

  const handleBugReport = () => {
    setShowBugModal(true);
  };


  const [session_id, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(generateID());
  }, []);

  const webcamRef = React.useRef(null);
  const WebcamCapture = async () => {
    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();},
        [webcamRef]
    );
  };

  return (
    <React.Fragment>
      {showBugModal ? (
        <Modal
          close={() => setShowBugModal(false)}
          title="🐛 Bug Report"
          description="Please use this form to report individual bugs you find e.g. strange, unexpected responses, error messages etc. Please submit a separate form for each bug you find"
        >
          <BugReport session_id={session_id} />
        </Modal>
      ) : null}
      <div className="container">
        <Link className="nav-link" to={`/templates/${template.template}/setup`}>
          &#8592; Back to setup
        </Link>
        <h1 className="title">3. Ready!</h1>
        <h3 className="sub-title">Test and share your experiment</h3>
        <div className="preview-container">
          <div style={{ textAlign: 'center' }}>
            <h2>{title}</h2>
            <p style={{ marginTop: 5 }}>
              <small style={{ fontSize: 14 }}>{description}</small>
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
              <label htmlFor="consent">{consentNote}</label>
            </div>
          </div>
          <div className="divider"></div>
          {start ? (
            <div
              className="preview"
              style={{
                position: 'relative',
                // flexDirection:
                //   template === 'chat-content-webcam' ? 'row-reverse' : 'row',
              }}
            >
              {template === 'chat-content-background' &&
              developmentPlatform !== '' ? (
                <button
                  className="button slategrey"
                  style={{ position: 'absolute', bottom: -40, right: 20 }}
                  onClick={() => toggleBot(!showBot)}
                >
                  {showBot ? 'X' : '+'}
                </button>
              ) : null}
              {template !== 'chat-only' ? (
                <div
                  className={`display-area ${
                    template === 'chat-content-background' ? 'full-width' : ''
                  }`}
                  dangerouslySetInnerHTML={displayAreaMarkup()}
                  >
                </div>
              ) : null}
              {template === 'chat-content-webcam' ? (
                  <WebCamera
                      deviceId={webcamId}
                  />
              ): null}

              {developmentPlatform === 'custom-server' ? (
                <div
                  className={
                    template === 'chat-content-background'
                      ? 'bot-area floating'
                      : 'bot-area'
                  }
                >
                {showBot ? (
                  <ChatWindow
                    title={botName}
                    botIcon={botIcon}
                    serverURL={serverURL}
                    session_id={session_id}
                    chats={chats}
                    enableVoice={enableVoice}
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
              {enableBugReport ? (
                <button
                  onClick={handleBugReport}
                  className="button bug-report-btn"
                >
                  🐛 Bug Report
                </button>
              ) : null}
              {enableFeedback ? (
                <a
                  href={feedbackLink}
                  target="_blank"
                  className="button feedback-btn"
                  style={{ marginLeft: 10 }}
                >
                  Share Overall Feedback 🙂
                </a>
              ) : null}
              {/* <div> */}
              {/* <input
                  type="file"
                  accept=".txt"
                  onClick={handleUploadTextFile}
                  className="button bug-report-btn"
                />
                  Upload text file
                </div> */}
            </div>
          ) : null}
        </div>
        {start ? (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <input
              className="share-input"
              placeholder={`${import.meta.env.VITE_BASE_URL}/demo/${template.template}/${botId}`}
              disabled
            />{' '}
            <button className="share-button" onClick={setCopied}>
              {isCopied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
