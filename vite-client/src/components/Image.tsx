import { Camera } from "react-bootstrap-icons";
import { ConfigContext } from "../app/configContext";
import { Key, useContext} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Spinner} from "react-bootstrap";

function Image() {
    const {setSelectedComponent, isDnDDisabled, images, isImageLoading} =
        useContext(ConfigContext);

    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable({
            id: "image-content",
            disabled: isDnDDisabled,
        });
    const style = transform
        ? {
            transform: CSS.Translate.toString(transform),
            transition,
        }
        : undefined;

    // IF isImageLoading is true, It will render the spinner
    if (isImageLoading)
        return (
            <div className="h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Uploading...</span>
                </Spinner>
            </div>
        );

    const handleFileExtention = (url: string) => {
        if (url.toLowerCase().includes(".mp4")) {
            return "video";
        } else {
            // Assume it's an image if it doesn't seem to be a video
            return "image";
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={{...style, overflowY: "auto"}}
            {...listeners}
            {...attributes}
            className="h-100 bg-white"
            onClick={() => setSelectedComponent("image-content")}
        >
            {images.length ? (
                // If there are images, render the following:
                <div
                    className="d-flex flex-row flex-wrap gap-2 overflow-y-auto h-100"
                    style={{
                        maxHeight: "85vh",
                    }}
                >
                    {images.map((url: string | undefined, index: Key | null | undefined) => (
            <div className="flex-grow-1" key={index}>
              {handleFileExtention(url) === "video" ? (
                <video width="100%" height="100%" controls alt="video">
                  <source src={url} type="video/mp4" />
                  <source src={url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={url}
                  className="object-fit-contain rounded p-1"
                  style={{
                    height: "auto",
                    width: "100%",
                  }}
                  alt="image"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        // If there are no images, render the following:
        <div className="h-100 d-flex justify-content-center align-items-center">
          <Camera size={50} />
        </div>
      )}
    </div>
  );
}

export default Image;
