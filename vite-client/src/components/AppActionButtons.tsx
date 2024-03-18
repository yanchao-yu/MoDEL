
import { Button } from "react-bootstrap";

function AppActionButtons({ config }) {

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
          </>
        )}
    </>
  );
}

export default AppActionButtons;
