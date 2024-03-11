import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { ConfigContext } from "../app/configContext";

function AppActionButtons({ setAppStatus }) {
  const {
    selectedChatOption,
    setSelectedChatOption,
    isEditText,
    setSelectedComponent,
  } = useContext(ConfigContext);

  return (
    <>
      <Button
        variant={"outline-primary"}
        onClick={() => {
          setSelectedChatOption("");
          setSelectedComponent(null);
        }}
      >
        Gernal Setup
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => {
          setSelectedChatOption("chat-with-content");
          setSelectedComponent(null);
        }}
      >
        Chat Content
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => {
          setSelectedChatOption("chat-with-image");
          setSelectedComponent(null);
        }}
      >
        Chat Image
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => {
          setSelectedChatOption("chat-only");
          setSelectedComponent(null);
        }}
      >
        Chat Only
      </Button>
      {selectedChatOption !== "chat-options" &&
        selectedChatOption !== "user-consent" &&
        !isEditText && (
          <>
            <Button
              variant="primary"
              onClick={() => {
                setAppStatus("preview");
                setSelectedComponent(null);
              }}
              disabled={
                selectedChatOption === "chat-options" ||
                selectedChatOption === "user-consent"
              }
            >
              Preview
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setAppStatus("launch");
                setSelectedComponent(null);
              }}
              disabled={
                selectedChatOption === "chat-options" ||
                selectedChatOption === "user-consent"
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
