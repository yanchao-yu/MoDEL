import React, { useContext } from "react";
import { ConfigContext } from "../app/configContext";
import {Button} from "react-bootstrap";

const GoBackButton = ({ title }) => {
  const { selectedChatOption, setSelectedChatOption, appStatus, setAppStatus } =
    useContext(ConfigContext);
  return (
    <>
      <div className="pb-2 w-fit ps-3">
        <Button
          onClick={() => {
            setAppStatus("edit");
            setSelectedChatOption("");
          }}
        >
          &larr; {title ? title : "Go Back"}
        </Button>
      </div>
    </>
  );
};

export default GoBackButton;
