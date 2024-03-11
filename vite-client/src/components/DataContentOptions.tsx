import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Preloader from "./Preloader";
import { ConfigContext } from "../app/configContext";
// import { KeyboardBackspace } from "@mui/icons-material";

const DataContentOptions = () => {
  const {
    getChatOnlyData,
    updateChatOnlyData,
    chatOnly,
    setChatOnly,
    setSelectedChatOption,
  } = useContext(ConfigContext);

  const [title, setTitle] = useState(chatOnly?.title ? chatOnly?.title : "");
  const [description, setDescription] = useState(
    chatOnly?.description ? chatOnly?.description : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setChatOnly({ title, description });
    return updateChatOnlyData()
      .then((res) => {
        setSelectedChatOption("");
        setLoading(false);
        getChatOnlyData();
      })
      .catch((error) => {
        setLoading(false);
        getChatOnlyData();
      });
  };

  return (
    <>
      {loading ? (
        <Preloader className=" w-100" />
      ) : (
        <form
          style={{ background: "white" }}
          className="py-2 px-3 w-100"
          onSubmit={(e) => handleSave(e)}
        >
          <div className="d-flex gap-2">
            {/* <KeyboardBackspaceIcon /> */} &larr;
            <p className="fw_bolder">Back to layout</p>
          </div>
          <div className="d-flex gap-2">
            <h1 className="fw_bolder">Chat Only</h1>
          </div>
          <div className="form-group py-2">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group py-2">
            <label className="form-check-label" htmlFor="description">
              Description*
            </label>
            <ReactQuill
              theme="snow"
              id="description"
              name="description"
              value={description}
              onChange={(value) => {
                setDescription(value);
              }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default DataContentOptions;
