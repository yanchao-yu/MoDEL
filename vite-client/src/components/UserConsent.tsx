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
      // userConsent?.enable_overall_feedback && document.getElementById('enableFeedback')?.click();
      // userConsent?.enable_bug_report && document.getElementById('enableBugReport')?.click();
      // document.getElementById('enableBugReport')?.click();
      // console.log("sjhdf", document.getElementById("enableBugReport")?.value);
    }
  }, [userConsent]);

  // useEffect(()=>{

  // }, [])

  // console.log("bug report", enableBugReport, "enableFeeback", enableFeeback)

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
        <Preloader className=" w-100" />
      ) : (
        <form
          style={{ background: "white" }}
          className="py-2 px-3  w-100"
          onSubmit={(e) => handleSave(e)}
        >
          {/* {selectedChatOption && <GoBackButton />} */}

          {/* <div className="form-group py-2">
          <select className="form-control form-control-lg">
            <option>Select Option</option>
          </select>
        </div> */}
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

            {/* <input
              className="form-check-input"
              type="checkbox"
              onChange={(e) => {
                console.log("ebale", e.target.value)
                setEnableBugReport(e.target.value);
              }}
              value={enableBugReport?"on":"off"}
              id="enableBugReport"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Enable Bug Report
            </label> */}
          </div>
          {/* <div className="form-check py-2">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={(e) => {
                setEnableVoice(e.target.value);
              }}
              value={enableVoice}
            />
            <label className="form-check-label" for="flexCheckDefault">
              Enable Voice input/Output
            </label>
          </div> */}
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

            {/* <input
              className="form-check-input"
              type="checkbox"
              onChange={(e) => {
                setEnableFeeback(e.target.value);
              }}
              id="enableFeedback"
              value={enableFeeback}
            />
            <label className="form-check-label" htmlFor="enableFeeback">
              Enable Overall Feedback
            </label> */}
          </div>
          {enableFeeback ? (
            <div className=" border bg-dark my-3 shadow px-3 py-2 text-white rounded">
              {window?.location?.host}
            </div>
          ) : (
            <></>
          )}
          <div className=" py-2">
            <button type="submit" className="btn btn-primary">
              Save and Preview
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default UserConsent;
