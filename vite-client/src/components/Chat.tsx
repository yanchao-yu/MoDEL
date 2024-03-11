import { useContext, useEffect, useRef, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { Send, Mic, MicFill } from "react-bootstrap-icons";
import { ConfigContext } from "../app/configContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useSpeechToText from "react-hook-speech-to-text";

function Chat() {
  const messagesContainerRef = useRef(null);
  const {
    setSelectedComponent,
    isDnDDisabled,
    messages,
    addMessage,
    enableVoice,
    chatData,
  } = useContext(ConfigContext);

  // Message state to store the message
  const [message, setMessage] = useState("");

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (error)
      return <p>Web Speech API is not available in this browser 🤷‍</p>;
  }, [error]);

  // Send message function handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    addMessage(message);
    setMessage("");
  };

  // Scroll to the bottom of the messages container when the messages state changes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: "chat-content",
      disabled: isDnDDisabled,
    });
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, overflowY: "auto", maxHeight: "85vh" }}
      {...listeners}
      {...attributes}
      className="h-100 w-100 d-flex flex-column justify-content-between bg-white p-2 gap-2"
      onClick={() => {
        setSelectedComponent("chat-content");
      }}
    >
      <h3>{chatData?.bot_name}</h3>
      {/* Chat Messages */}
      <Stack
        direction="vertical"
        gap={2}
        className="w-100 overflow-y-auto"
        style={{ flexGrow: 10 }}
        ref={messagesContainerRef}
      >
        <div
          className={`border rounded py-1 px-2 ${"bg-secondary text-white"}`}
        >
          {chatData?.bot_name}
        </div>
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`border rounded py-1 px-2 ${
                message.sender === "user"
                  ? // If the message is sent by the user
                    "bg-light"
                  : // If the message is sent by the bot
                    "bg-secondary text-white"
              }`}
            >
              {message.message}
            </div>
          );
        })}
      </Stack>

      {/* Input Message */}
      <Stack
        as="form"
        direction="horizontal"
        gap={2}
        onSubmit={handleSendMessage}
      >
        <input
          className="w-100 p-1"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button type="submit" id="chatSubmit">
          <Send size={18} />
        </Button>
        {
          enableVoice &&  <Button
          onClick={(e) => {
            if (isRecording) {
              stopSpeechToText(e);
              setMessage(interimResult);
            } else {
              startSpeechToText(e);
            }
          }}
          variant={isRecording ? "danger" : "outline-primary"}
        >
          {isRecording ? <Mic size={18} /> : <MicFill size={18} />}
        </Button>
        }
        {/* <Button
          onClick={(e) => {
            if (isRecording) {
              stopSpeechToText(e);
              setMessage(interimResult);
            } else {
              startSpeechToText(e);
            }
          }}
          variant={isRecording ? "danger" : "outline-primary"}
          disabled={enableVoice ? false : true}
        >
          {isRecording ? <Mic size={18} /> : <MicFill size={18} />}
        </Button> */}
      </Stack>
    </div>
  );
}

export default Chat;
