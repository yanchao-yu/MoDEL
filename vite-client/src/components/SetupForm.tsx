import * as React from 'react';
import {useState, useRef, useEffect, useContext} from 'react';
import 'react-dropdown/style.css';

import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Stack,
    Button,
} from "react-bootstrap";
import ComponentOptions from "../components/ComponentOptions";
import AppActionButtons from "../components/AppActionButtons";
import MainContainer from "../components/MainContainer";
import DataContent from "../components/DataContent";
import AsideContent from "../components/AsideContent";
import Image from "../components/Image";
import ChatWindow from "../components/ChatWindow";
import { ConfigContext } from "../app/configContext";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import WebcamCapture from "../components/WebcamCapture";
import JsonPreviewer from "../components/JsonPreviewer";
import UserConsent from "../components/UserConsent";
import DisplayUserConsent from "../components/DisplayUserConsent";
import {generateString, postData} from "../utils";
import {useHistory} from "react-router-dom";


export default function SetupForm({ display_area = true, webcam = true}) {
    const history = useHistory();

    const dataCtx =React.useContext(ConfigContext)
    const botId = generateString(8);
    useEffect(() => {
        if (!dataCtx.botID)
            dataCtx.setBotID(botId)
    }, [dataCtx.botID]);

    const [componentOrder, setComponentOrder] = useState([
        "data-content",
        "image-content",
        "chat-content",
    ]);
    const [components, setComponents] = useState([null, null, null]);

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

    const gotoLaunch = () => {
        console.log('botId: '+ dataCtx.botID);

        dataCtx.setAppStatus("launch");
        dataCtx.setSelectedComponent(null);

        const dataObj = {
            "botID": dataCtx.botID,
            "isDnDDisabled": dataCtx.isDnDDisabled,
            "selectedComponent": dataCtx.selectedComponent,
            "fontColor": dataCtx.fontColor,
            "editedText": dataCtx.editedText,
            "fontSize": dataCtx.fontSize,
            "textData": dataCtx.textData,
            "images": dataCtx.images,
            "messages": dataCtx.messages,
            "messageData": dataCtx.messageData,
            "jsonViewer": dataCtx.jsonViewer,
            "selectedChatOption": dataCtx.selectedChatOption,
            "enableVoice": dataCtx.enableVoice,
            "chatData": dataCtx.chatData,
            "editedChatOptions": dataCtx.editedChatOptions,
            "chatOnly": dataCtx.chatOnly,
            "userConsent": dataCtx.userConsent,
            "sameComponents": dataCtx.sameComponents,
            "appStatus": dataCtx.appStatus,
            "agreeToLaunch": dataCtx.agreeToLaunch,
            "feedbackLink": dataCtx.feedbackLink,
        };
        window.localStorage.setItem('obj', JSON.stringify(dataObj));
        const url = `${import.meta.env.VITE_SERVER_URL}/v1/demo/?id=${dataCtx.botID}`;
        console.log('url1: '+ `${import.meta.env.VITE_SERVER_URL}`);
        console.log('url2: '+ `${import.meta.env.VITE_BASE_URL}`);
        console.log('obj: '+ JSON.stringify(dataObj));

        postData(url, dataObj)
            .then(async (data) => {
                console.log(data);
                history.push(`/launch`);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        // It is used to create components based on the component order
        const _components = componentOrder.map((id) => {
            switch (id) {
                case "data-content":
                    return dataCtx.selectedChatOption !== "chat-only" &&
                    dataCtx.selectedChatOption !== "chat-with-image" ? (
                        <DataContent />
                    ) : (
                        ""
                    );
                case "image-content":
                    return dataCtx.selectedChatOption !== "chat-only" &&
                    dataCtx.selectedChatOption !== "chat-with-content" ? (
                        <Image />
                    ) : (
                        ""
                    );
                case "webcam-content":
                    return <WebcamCapture />;
                case "chat-content":
                    return   <ChatWindow
                        title= {dataCtx.chatData.botName}
                        botIcon={dataCtx.chatData.botIcon}
                        serverURL={dataCtx.chatData.serverURL}
                        session_id={dataCtx.chatData.session_id}
                        userInputObj={dataCtx.chatData.userInputObj}
                        userinputKey={dataCtx.chatData.userinputKey}
                        sysoutputKey={dataCtx.chatData.sysoutputKey}
                        chats={[]}
                        enableVoice={dataCtx.chatData.enableVoice}
                        updateChats={dataCtx.chatData.messages}
                        // getDialogueLog={dataCtx.getDialogueLog}
                    />;
                default:
                    return null;
            }
        });
        setComponents(_components);
    }, [componentOrder, dataCtx.selectedChatOption]);

    useEffect(() => {
        dataCtx.setSameComponents(
            dataCtx.selectedChatOption && components[0] && (components[1] || components[2])
                ? true
                : false
        );
    }, [dataCtx.selectedChatOption, components]);

    const SortedSections = () => (
        <SortableContext
            items={componentOrder}
            className={` gap-2 ${
                dataCtx.selectedChatOption && !dataCtx.sameComponents ? "d-flex" : ""
            }`}
        >
            {dataCtx.selectedChatOption ? (
                <div className="pe-1 w-100">
                    {components[0] && (
                        <Col
                            xs={
                                dataCtx.selectedChatOption && !dataCtx.sameComponents
                                    ? 12
                                    : dataCtx.sameComponents
                                        ? 6
                                        : dataCtx.appStatus !== "edit"
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
                            dataCtx.selectedChatOption && !dataCtx.sameComponents
                                ? 12
                                : dataCtx.sameComponents
                                    ? 6
                                    : dataCtx.appStatus !== "edit"
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
                        dataCtx.selectedChatOption && !dataCtx.sameComponents
                            ? 12
                            : dataCtx.sameComponents
                                ? 6
                                : dataCtx.appStatus !== "edit"
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
                                    height:
                                        dataCtx.appStatus === "preview" ||
                                        (dataCtx.appStatus !== "launch" && dataCtx.selectedChatOption)
                                            ? "90%"
                                            : "90%",
                                }}
                            >
                                <div className="pb-2 w-fit ps-3">
                                    {dataCtx.appStatus === "preview" && (
                                        <div>
                                            <Button
                                                style={{float: "left"}}
                                                onClick={() => {
                                                    dataCtx.setAppStatus("edit");
                                                    // setSelectedChatOption("");
                                                    dataCtx.setSelectedComponent(null);
                                                }}
                                            >
                                                &larr; Go Back
                                            </Button>
                                            <Button
                                                style={{float: "right"}}
                                                variant="primary"
                                                onClick={() => {

                                                    gotoLaunch();
                                                }}
                                                disabled={
                                                    dataCtx.selectedChatOption === "chat-options" ||
                                                    dataCtx.selectedChatOption === "user-consent"
                                                }
                                            >
                                                Launch
                                            </Button>
                                        </div>
                                    )}
                                    {dataCtx.appStatus === "launch" &&
                                        dataCtx.agreeToLaunch &&
                                        dataCtx.userConsent?.enable_overall_feedback && (
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Button>Share Overall Feedback</Button>
                                                <div className="input-group mb-3 w-50">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={`${import.meta.env.VITE_BASE_URL}/demo/${botId}`}
                                                        aria-label="Recipient's username"
                                                        aria-describedby="basic-addon2"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        )}
                                </div>
                                {dataCtx.appStatus === "edit" && (
                                    <Col xs={2}>
                                        <Stack
                                            direction="vertical"
                                            gap={2}
                                            className="h-100 border rounded bg-white p-2"
                                        >
                                            <ComponentOptions />
                                            <AppActionButtons config={dataCtx} />
                                        </Stack>
                                    </Col>
                                )}
                                {dataCtx.selectedChatOption ? (
                                    <Col
                                        xs={dataCtx.appStatus !== "edit" ? 12 : 10}
                                        className={`h-100 border bg-white px-3 py-2 overflow-y-auto ${
                                            dataCtx.selectedChatOption && dataCtx.sameComponents ? "d-flex" : ""
                                        }`}
                                    >
                                        {dataCtx.selectedChatOption === "chat-options" ? (
                                            <JsonPreviewer />
                                        ) : dataCtx.selectedChatOption === "user-consent" ? (
                                            <UserConsent />
                                        ) : dataCtx.appStatus !== "launch" ? (
                                            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                                                {SortedSections()}
                                            </DndContext>
                                        ) : dataCtx.appStatus === "launch" && !dataCtx.agreeToLaunch ? (
                                            <DisplayUserConsent />
                                        ) : (
                                            SortedSections()
                                        )}
                                    </Col>
                                ) : dataCtx.appStatus !== "launch" ? (
                                    <DndContext
                                        sensors={sensors}
                                        onDragEnd={handleDragEnd}
                                        className="w-100"
                                    >
                                        {SortedSections()}
                                    </DndContext>
                                ) : dataCtx.appStatus === "launch" && !dataCtx.agreeToLaunch ? (
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