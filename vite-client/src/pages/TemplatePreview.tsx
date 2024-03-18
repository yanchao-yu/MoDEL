import * as React from 'react';
import { useState, useEffect } from 'react';
import useClipboard from 'react-use-clipboard';
import ChatWindow from '../components/ChatWindow';
import {generateID, generateString} from '../utils';
import {Tabs, Tab, Button, Form, Col, Stack, Card, CardBody, Container, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import DataContent from "../components/DataContent";
import Image from "../components/Image";
import WebcamCapture from "../components/WebcamCapture";
import MainContainer from "../components/MainContainer";
import AsideContent from "../components/AsideContent";
import UserConsent from "../components/UserConsent";
import DisplayUserConsent from "../components/DisplayUserConsent";

export default function TemplatePreview() {
  const{
    botID,
    isDnDDisabled,
    selectedComponent,
    fontColor,
    editedText,
    fontSize,
    textData,
    images,
    messages,
    messageData,
    jsonViewer,
    selectedChatOption,
    enableVoice,
    chatData,
    editedChatOptions,
    chatOnly,
    userConsent,
    sameComponents,
    appStatus,
    agreeToLaunch,
    feedbackLink
  } = JSON.parse(window.localStorage.getItem('obj'));

  console.log(botID)

  const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: "user"
  };


  const [showBugModal, setShowBugModal] = useState(false);

  const [dialogue_log, setDialogueLog] = useState({});

  const handleBugReport = async () => {
    setShowBugModal(true);
    console.log('showBugModal: '+ showBugModal)
    window.scrollTo(0, 0);
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

  // const exportData = () => {
  //   const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
  //       JSON.stringify(dialogue_log)
  //   )}`;
  //   const link = document.createElement("a");
  //   link.href = jsonString;
  //   link.download = botName+"_log_"+ Date.now()+".json";
  //
  //   link.click();
  // };


  // const dataCtx =React.useContext(ConfigContext)
  // console.log(dataCtx)
  const [componentOrder, setComponentOrder] = useState([
    "data-content",
    "image-content",
    "chat-content",
  ]);
  const [components, setComponents] = useState([null, null, null]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Function to handle drop end event
  const handleDragEnd = (event: { active: any; over: any; }) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setComponentOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // It is used to create a sensor to detect the pointer events
  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          // The distance in pixels the pointer must travel to activate a drag
          distance: 10,
        },
      })
  );

  useEffect(() => {
    // It is used to create components based on the component order
    const _components = componentOrder.map((id) => {
      switch (id) {
        case "data-content":
          return selectedChatOption !== "chat-only" &&
          selectedChatOption !== "chat-with-image" ? (
              <DataContent />
          ) : (
              ""
          );
        case "image-content":
          return selectedChatOption !== "chat-only" &&
          selectedChatOption !== "chat-with-content" ? (
              <Image />
          ) : (
              ""
          );
        case "webcam-content":
          return <WebcamCapture />;
        case "chat-content":
          return   <ChatWindow
              title= {chatData['bot_name']}
              botIcon={chatData['botIcon']}
              serverURL={chatData['serverURL']}
              session_id={chatData['id']}
              userInputObj={chatData['userInputObj']}
              userinputKey={chatData['userinput_key']}
              sysoutputKey={chatData['sysoutput_key']}
              chats={[]}
              enableVoice={enableVoice}
              updateChats={messages}
          />;
        default:
          return null;
      }
    });
    setComponents(_components);
  }, [componentOrder, selectedChatOption]);

  const SortedSections = () => (
      <SortableContext
          items={componentOrder}
          className={` gap-2 ${
              selectedChatOption && !sameComponents ? "d-flex" : ""
          }`}
      >
        {selectedChatOption ? (
            <div className="pe-1 w-100">
              {components[0] && (
                  <Col
                      xs={
                        selectedChatOption && !sameComponents
                            ? 12
                            : sameComponents
                                ? 6
                                : appStatus !== "edit"
                                    ? 7
                                    : 6
                      }
                      className="h-100 w-100"
                  >
                    <MainContainer component={components[0]} />
                  </Col>
              )}
            </div>
        ) : (
            components[0] && (
                <Col
                    xs={
                      selectedChatOption && !sameComponents
                          ? 12
                          : sameComponents
                              ? 6
                              : appStatus !== "edit"
                                  ? 7
                                  : 6
                    }
                    className="h-100"
                >
                  <MainContainer component={components[0]} />
                </Col>
            )
        )}

        {(components[1] || components[2]) && (
            <Col
                xs={
                  selectedChatOption && !sameComponents
                      ? 12
                      : sameComponents
                          ? 6
                          : appStatus !== "edit"
                              ? 5
                              : 4
                }
                className="h-100"
            >
              <AsideContent
                  topComponent={components[1]}
                  bottomComponent={components[2]}
              />
            </Col>
        )}
      </SortableContext>
  );

  const [isCopied, setCopied] = useClipboard(
      `${import.meta.env.VITE_BASE_URL}/demo/${botID}`
  );

  return (
      <div>
        <Stack
            direction="vertical"
            gap={2}
            className="align-items-end p-3"
            style={{ height: "100dvh", maxHeight: "100vh" }}
        >
          <Card className="py-2 bg-light w-100 " style={{ height: "100%" }}>
            <CardBody>
              <Container fluid style={{ height: "100%" }}>
                <Row
                    className="gx-2 "
                    style={{
                      height: "90%",
                    }}
                >
                  <div className="pb-2 w-fit ps-3">
                    {appStatus === "launch" &&
                        agreeToLaunch &&
                        userConsent?.enable_overall_feedback && (
                            <div className="d-flex justify-content-between align-items-center">
                              <Button>Share Overall Feedback</Button>
                            </div>
                        )}
                    <div className="input-group mb-3 w-50">
                      <input
                          type="text"
                          className="form-control"
                          placeholder={`${import.meta.env.VITE_BASE_URL}/demo/${botID}`}
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                          disabled
                      />
                      <Button
                          className="input-group-text"
                          id="basic-addon2"
                          onClick={setCopied}
                      >
                        {linkCopied ? "Link Copied" : "Copy Link"}
                      </Button>
                    </div>
                  </div>
                  {selectedChatOption ? (
                      <Col
                          xs={10}
                          className={`h-100 border bg-white px-3 py-2 overflow-y-auto ${
                              selectedChatOption && sameComponents ? "d-flex" : ""
                          }`}
                      >
                        {selectedChatOption === "user-consent" ? (
                            <UserConsent />
                        ) : appStatus !== "launch" ? (
                            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                              {SortedSections()}
                            </DndContext>
                        ) : appStatus === "launch" && !agreeToLaunch ? (
                            <DisplayUserConsent />
                        ) : (
                            SortedSections()
                        )}
                      </Col>
                  )
                      : appStatus === "launch" && !agreeToLaunch ? (
                      <DisplayUserConsent />
                  ) : (
                      SortedSections()
                  )}
                </Row>
              </Container>
            </CardBody>
          </Card>
        </Stack>
      </div>
  );
}
