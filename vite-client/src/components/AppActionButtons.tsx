import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { ConfigContext } from "../app/configContext";
import {useHistory} from "react-router-dom";
import {generateString, postData} from "../utils";

function AppActionButtons({ config }) {

    const history = useHistory();
    const gotoLaunch = () => {
        const botId = generateString(8);
        config.setBotID(botId)
        console.log('botId: '+ botId);

        config.setAppStatus("launch");
        config.setSelectedComponent(null);

        const dataObj = {
            "botID": config.botID,
            "isDnDDisabled": config.isDnDDisabled,
            "selectedComponent": config.selectedComponent,
            "fontColor": config.fontColor,
            "editedText": config.editedText,
            "fontSize": config.fontSize,
            "textData": config.textData,
            "images": config.images,
            "messages": config.messages,
            "messageData": config.messageData,
            "jsonViewer": config.jsonViewer,
            "selectedChatOption": config.selectedChatOption,
            "enableVoice": config.enableVoice,
            "chatData": config.chatData,
            "editedChatOptions": config.editedChatOptions,
            "chatOnly": config.chatOnly,
            "userConsent": config.userConsent,
            "sameComponents": config.sameComponents,
            "appStatus": config.appStatus,
            "agreeToLaunch": config.agreeToLaunch,
            "feedbackLink": config.feedbackLink,
        };
        window.localStorage.setItem('obj', JSON.stringify(dataObj));
        const url = `${import.meta.env.VITE_SERVER_URL}/v1/demo/?id=${config.botID}`;
        console.log('url1: '+ `${import.meta.env.VITE_SERVER_URL}`);
        console.log('url2: '+ `${import.meta.env.VITE_BASE_URL}`);
        console.log('obj: '+ JSON.stringify(dataObj));

        postData(url, dataObj)
            .then(async (data) => {
                console.log(data);
                history.push(`/preview`);
            })
            .catch((err) => console.log(err));
    };

    return (
    <>
      <Button
        variant={"outline-primary"}
        onClick={() => {
            config.setSelectedChatOption("");
            config.setSelectedComponent(null);
        }}
      >
        Gernal Setup
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => {
            config.setSelectedChatOption("chat-with-content");
            config.setSelectedComponent(null);
        }}
      >
        Chat Content
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => {
            config.setSelectedChatOption("chat-with-image");
            config.setSelectedComponent(null);
        }}
      >
        Chat Image
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => {
            config.setSelectedChatOption("chat-only");
            config.setSelectedComponent(null);
        }}
      >
        Chat Only
      </Button>
      {config.selectedChatOption !== "chat-options" &&
          config.selectedChatOption !== "user-consent" &&
        !config.isEditText && (
          <>
            <Button
              variant="primary"
              onClick={() => {
                  config.setAppStatus("preview");
                  config.setSelectedComponent(null);
              }}
              disabled={
                  config.selectedChatOption === "chat-options" ||
                  config.selectedChatOption === "user-consent"
              }
            >
              Preview
            </Button>
                <Button
                  variant="primary"
                  onClick={() => {

                      gotoLaunch();
                  }}
                  disabled={
                      config.selectedChatOption === "chat-options" ||
                      config.selectedChatOption === "user-consent"
                  }
                >
                  Launch
                </Button>
          </>
        )}
    </>
  );
}

export default AppActionButtons;
