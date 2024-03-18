import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ConfigContext } from "../app/configContext";
import Preloader from "./Preloader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const UserConsent = () => {
  const {
    getUserConsent,
    updateUserConsent,
    userConsent,
    setUserConsent,
    setSelectedChatOption,
    selectedChatOption,
    setFeedbackLink,
  } = useContext(ConfigContext);
  const [description, setDescription] = useState("");
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableBugReport, setEnableBugReport] = useState(true);
  const [enableFeeback, setEnableFeeback] = useState(true);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setUserConsent({
  //     ...userConsent,
  //     description,
  //     enable_voice: enableVoice,
  //     enable_bug_report: enableBugReport,
  //     enable_overall_feedback: enableFeeback,
  //   });
  // }, [description, enableVoice, enableBugReport, enableFeeback]);

  useEffect(() => {
    if (userConsent) {
      setDescription(userConsent?.description ? userConsent?.description : "");
      setEnableVoice(userConsent?.enable_voice ? true : false);
      setEnableBugReport(userConsent?.enable_bug_report ? true : false);
      setEnableFeeback(userConsent?.enable_overall_feedback ? true : false);
    }
  }, [userConsent]);


  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setLoading(true);
    setUserConsent({
      ...userConsent,
      description,
      enable_voice: enableVoice,
      enable_bug_report: enableBugReport,
      enable_overall_feedback: enableFeeback,
    });
    // return updateUserConsent()
    //   .then((res) => {
    setSelectedChatOption("");
    setLoading(false);
    // getUserConsent();
    //   })
    //   .catch((error) => {
    // setLoading(false);
    //     getUserConsent();
    //   });
  };

  // console.log("window", window.location.host)

  return (
    <>
      {loading ? (
        <Preloader className="w-100" />
      ) : (
        <form
          style={{ background: "white" }}
          className="py-2 px-3  w-100"
          onSubmit={(e) => handleSave(e)}
        >
          <div className="d-flex gap-2">
            <hr style={{ width: "20px" }} />
            <h1 className="fw_bolder">User Consent</h1>
          </div>
          <div className="form-group py-2">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
            />
          </div>
          <div className="form-check py-2">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={enableBugReport}
                  onChange={(e) => {
                    setEnableBugReport(e.target.checked);
                  }}
                />
              }
              label="Enable Bug Report"
            />
          </div>
          <div className="form-check py-2">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={enableFeeback}
                  onChange={(e) => {
                    setEnableFeeback(e.target.checked);
                  }}
                />
              }
              label="Enable Overall Feedback"
            />
          </div>
          {enableFeeback ? (
              <input
                  style={{ marginTop: 10 }}
                  className="styled-input"
                  placeholder="Provide Form Link (https://docs.google.com/forms/...)"
                  onChange={(e) => setFeedbackLink(e.currentTarget.value)}
              />
          ) :  (
              <></>
          )}
          <div className=" py-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default UserConsent;
