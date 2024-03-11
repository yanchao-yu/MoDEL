import * as React from 'react';
import {useState, useRef, useEffect, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { postData, generateString } from '../utils';
import 'react-dropdown/style.css';
import Darkmode from 'drkmd-js'
import xtype from 'xtypejs'

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
import Chat from "../components/Chat";
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
import DataContentOptions from "../components/DataContentOptions";
import useClipboard from 'react-use-clipboard';
import DisplayUserConsent from "../components/DisplayUserConsent";


import {sampleInputData, sampleOutputData} from '../hooks/sampleData'
import {DataContext} from "../app/store";

export default function SetupForm({ display_area = true, webcam = true}) {
    const botId = generateString(8);
    const dataCtx =React.useContext(ConfigContext)
    console.log(dataCtx)

    // const {
    //     selectedChatOption,
    //     sameComponents,
    //     setSameComponents,
    //     appStatus,
    //     setAppStatus,
    //     setSelectedChatOption,
    //     agreeToLaunch,
    //     setAgreeToLaunch,
    //     setSelectedComponent,
    //     userConsent,
    // } = useContext(ConfigContext);
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
                    return <Chat />;
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

    const [isCopied, setCopied] = useClipboard(
        `${import.meta.env.VITE_BASE_URL}/demo/${botId}`
    );

    // const dataObj = {
    //     "botId": botId,
    //     "title": title,
    //     "description":
    //         descriptionEditorRef.current?.getContent() || '<p>No content provided</p>',
    //     "embedCode": embedCode,
    //     "developmentPlatform": developmentPlatform,
    //     "botName": botName,
    //     "botIntro": botIntro,
    //     "botIcon": botIcon,
    //     "serverURL": serverURL,
    //     "userInputObj": userInputObj,
    //     "userinputKey": userinput_key,
    //     "sysoutputKey": sysoutput_key,
    //     "consentNote":
    //         concentEditorRef.current?.getContent() || '<p>No content provided</p>',
    //     "enableBugReport": enableBugReport,
    //     "enableFeedback": enableFeedback,
    //     "enableVoice": enableVoice,
    //     "webcamId": webcamId,
    //     "feedbackLink": feedbackLink || 'https://forms.gle/PE9Sef4tLrQPW6bE6',
    //     "displayContent":
    //         editorRef.current?.getContent() || '<p>No content provided</p>',
    // };
    // setLoading(true);
    // window.localStorage.setItem('obj', JSON.stringify(dataObj));
    // const url = `${import.meta.env.VITE_SERVER_URL}/v1/demo/?id=${botId}`;
    // console.log('url1: '+ `${import.meta.env.VITE_SERVER_URL}`);
    //   console.log('url2: '+ `${import.meta.env.VITE_BASE_URL}`);
    // console.log('dataObj: '+ dataObj);
    // postData(url, dataObj)
    //   .then(async (data) => {
    //     console.log(data);
    //     history.push(`/templates/${template.template}/preview`);
    //   })
    //   .catch((err) => console.log(err));
    // };

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
                                            : "100%",
                                }}
                            >
                                <div className="pb-2 w-fit ps-3">
                                    {dataCtx.appStatus === "preview" && (
                                        <Button
                                            onClick={() => {
                                                dataCtx.setAppStatus("edit");
                                                // setSelectedChatOption("");
                                                dataCtx.setSelectedComponent(null);
                                            }}
                                        >
                                            &larr; Go Back
                                        </Button>
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
                                                    <Button
                                                        className="input-group-text"
                                                        id="basic-addon2"
                                                        onClick={setCopied}
                                                    >
                                                        {linkCopied ? "Link Copied" : "Copy Link"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                </div>
                                {/* {!selectedChatOption && <DisplayUserConsent />} */}
                                {dataCtx.appStatus === "edit" && (
                                    <Col xs={2}>
                                        <Stack
                                            direction="vertical"
                                            gap={2}
                                            className="h-100 border rounded bg-white p-2"
                                        >
                                            <ComponentOptions />
                                            <AppActionButtons setAppStatus={dataCtx.setAppStatus} />
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