import React, { useState, useRef, useCallback, useContext, useEffect } from "react";
import Webcam from "react-webcam";
import { ConfigContext } from "../app/configContext";
import {b64toFile} from 'b64-to-file'


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const {  setSelectedComponent, getImages, uploadImage } = useContext(ConfigContext);

  return (
    <div className="" style={{ zIndex: 9999999 }}>
      <Webcam
        audio={true}
        height={720}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        style={{ backgroundColor: "white" }}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              const convertedFile = b64toFile(imageSrc, "live camera photo")
              uploadImage(convertedFile);
              getImages();
              setSelectedComponent("image-content");
            }}
          >
            Capture photo
          </button>
        )}
      </Webcam>
    </div>
  );
};

export default WebcamCapture;

export { WebcamCapture };
