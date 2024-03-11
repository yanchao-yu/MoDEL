import { useContext } from "react";
import { ConfigContext } from "../app/configContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function DataContent() {
  const {
    setSelectedComponent,
    isDnDDisabled,
    fontColor,
    fontSize,
    textData,
    editedText,
    isEditText,
    setEditedText,
  } = useContext(ConfigContext);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: "data-content",
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
      {...listeners}
      {...attributes}
      style={{
        ...style,
        overflowY: "auto",
        maxHeight: "85vh",
        color: isEditText ? "#000" : fontColor,
        fontSize: isEditText ? "1rem" : `${fontSize}px`,
      }}
      className="h-100 p-2 bg-white"
      onClick={() => {
        setSelectedComponent("data-content");
      }}
    >
      {isEditText ? (
        // If isEditText is true, render the following:
        <div className="d-flex flex-column gap-2 w-100 h-100">
          <div>
            <p className="fw-bold">Heading</p>
            <textarea
              value={editedText?.heading ?? ""}
              onChange={(e) => {
                setEditedText({
                  heading: e.target.value,
                  paragraph: editedText?.paragraph,
                });
              }}
              className="w-100"
              style={{ resize: "none" }}
            />
          </div>
          <div className="w-100 h-auto">
            <p className="fw-bold">Paragraph</p>
            {/* <textarea
              value={editedText?.paragraph ?? ""}
              onChange={(e) => {
                setEditedText({
                  heading: editedText?.heading,
                  paragraph: e.target.value,
                });
              }}
              className="w-100 h-100"
              style={{ resize: "none" }}
            /> */}
            <ReactQuill
              theme="snow"
              id="description"
              name="description"
              value={editedText?.paragraph ?? ""}
              onChange={(value) => {
                setEditedText({
                  heading: editedText?.heading,
                  paragraph: value,
                });
              }}
              required
              style={{ maxHeight: "20vh !important" }}
            />
          </div>
        </div>
      ) : (
        // If isEditText is false, render the following:
        <>
          <h1 style={{ fontSize: "1.5em" }}>{textData?.heading ?? ""}</h1>
          {/* <p style={{ fontSize: "1em" }}>{textData?.paragraph ?? ""}</p> */}
          <div dangerouslySetInnerHTML={{__html: textData?.paragraph}} />
        </>
      )}
    </div>
  );
}

export default DataContent;
