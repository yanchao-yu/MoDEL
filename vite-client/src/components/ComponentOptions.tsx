import { useContext, useRef, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { ConfigContext } from "../app/configContext";
import { ChromePicker } from "react-color";
import WebcamCapture from "./WebcamCapture";
import { Mic, MicFill } from "react-bootstrap-icons";

export default function ComponentOptions() {
  // Get the selected component from the Context
  const { selectedComponent } = useContext(ConfigContext);

  return (
    <Stack gap={2} className="h-100">
      <Button variant="dark pe-none">Options</Button>

      {/** Options for DataContent, ImageContent, ChatContent */}
      {selectedComponent === "data-content" && <DataContentOptions />}
      {selectedComponent === "image-content" && <ImageContentOptions />}
      {selectedComponent === "webcam-content" && <WebcamCapture />}
      {selectedComponent === "chat-content" && <ChatContentOptions />}
    </Stack>
  );
}

// Options for DataContent
function DataContentOptions() {
  const {
    fontColor,
    setFontColor,
    fontSize,
    setFontSize,
    isEditText,
    handleIsEditText,
    updateTextData,
    selectedComponent,
    setSelectedComponent,
    appStatus,
    setAppStatus,
    setSelectedChatOption,
  } = useContext(ConfigContext);

  // Color Picker state
  const [showColorSelector, setShowColorSelector] = useState(false);

  // Handle color change
  const handleColorChange = (value) => {
    setFontColor(value?.hex);
  };

  // Color Picker styling
  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <>
      {!isEditText && (
        // If isEditText is false, render the following:
        <>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setFontSize(fontSize + 1);
            }}
            disabled={fontSize === 28}
          >
            Increase Font Size
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setFontSize(fontSize - 1);
            }}
            disabled={fontSize === 8}
          >
            Decrease Font Size
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowColorSelector(true);
            }}
          >
            Change Font Color
          </Button>
          {showColorSelector && (
            // If showColorSelector is true, render the following:
            <div style={popover}>
              <div
                style={cover}
                onClick={() => {
                  setShowColorSelector(false);
                }}
              />
              <ChromePicker color={fontColor} onChange={handleColorChange} />
            </div>
          )}
          <Button
            variant="outline-secondary"
            onClick={() => {
              handleIsEditText(true);
            }}
          >
            Edit Text
          </Button>
        </>
      )}
      {isEditText && (
        // If isEditText is true, render the following:
        <>
          <Button
            variant="outline-secondary"
            onClick={() => {
              updateTextData();
            }}
          >
            Save Text
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              handleIsEditText(false);
            }}
          >
            Cancel
          </Button>
        </>
      )}
      {appStatus !== "launch" && (
        <Button
          onClick={() => {
            setAppStatus("edit");
            setSelectedChatOption("");
            setSelectedComponent(null);
          }}
        >
          &larr; Go Back
        </Button>
      )}
    </>
  );
}

// Options for ImageContent
function ImageContentOptions() {
  // Get the image content states from the Context
  const {
    images,
    isImageLoading,
    addImage,
    removeImage,
    setSelectedComponent,
    appStatus,
    setAppStatus,
    selectedChatOption,
    setSelectedChatOption
  } = useContext(ConfigContext);
  // Reference to the input element
  const imageRef = useRef(null);

  return (
    <>
      <Button
        variant="outline-secondary"
        onClick={() => {
          setSelectedComponent("webcam-content");
        }}
      >
        Live Camera
      </Button>
      <Button
        variant="outline-secondary"
        onClick={() => {
          imageRef.current.click();
        }}
        disabled={images?.length >= 4 || isImageLoading}
      >
        Upload
      </Button>
      <Button
        variant="outline-secondary"
        onClick={() => removeImage()}
        disabled={images?.length <= 0 || isImageLoading}
      >
        Remove
      </Button>
      <input
        type="file"
        ref={imageRef}
        style={{ display: "none" }}
        id="update-product-image"
        hidden
        accept="image/png,image/jpeg,image/jpg, video/mp4"
        onChange={addImage}
      />
      {appStatus !== "launch" && (
        <Button
          onClick={() => {
            setAppStatus("edit");
            setSelectedChatOption("");
            setSelectedComponent(null);
          }}
        >
          &larr; Go Back
        </Button>
      )}
    </>
  );
}

// Options for ChatContent
function ChatContentOptions() {
  const {
    selectedChatOption,
    setSelectedChatOption,
    enableVoice,
    setEnableVoice,
    appStatus,
    setAppStatus,
    setSelectedComponent
  } = useContext(ConfigContext);

  return (
    <>
      <Button
        onClick={(e) => setEnableVoice(!enableVoice)}
        variant={enableVoice ? "danger" : "outline-primary"}
      >
        {enableVoice ? (
          <>
            Disable Voice <Mic size={18} />
          </>
        ) : (
          <>
            Enable Voice <MicFill size={18} />
          </>
        )}
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() =>
          setSelectedChatOption(
            selectedChatOption === "chat-options" ? "" : "chat-options"
          )
        }
      >
        {selectedChatOption === "chat-options"
          ? "Hide Chat Options"
          : "Chat Options"}
      </Button>
      <Button
        variant={"outline-primary"}
        onClick={() => setSelectedChatOption("user-consent")}
      >
        User Consent
      </Button>

      {/* <Button
        variant={"outline-primary"}
        onClick={() => setSelectedChatOption("data-content")}
      >
        Data Content
      </Button> */}
      {appStatus !== "launch" && (
        <Button
          onClick={() => {
            setAppStatus("edit");
            setSelectedChatOption("");
            setSelectedComponent(null);
          }}
        >
          &larr; Go Back
        </Button>
      )}
    </>
  );
}
