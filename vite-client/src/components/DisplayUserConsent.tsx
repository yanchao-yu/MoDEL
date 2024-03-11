import React, { useContext } from "react";
import { ConfigContext } from "../app/configContext";

const DisplayUserConsent = () => {
  const { userConsent, agreeToLaunch, setAgreeToLaunch } = useContext(ConfigContext);

  return (
    <>
      <div className="px-3 py-4 shadow-lg border m-auto d-flex flex-column justify-content-center align-content-center text-center">
        <p>No content provided</p>
        <p className="text-danger d-flex justify-content-center align-items-center gap-2">
          CONSENT: Please read the consent below before you continue
          {/* <div dangerouslySetInnerHTML={{ __html: userConsent?.desciption }} /> */}
        </p>
        <div>
          <div className=" d-flex flex-column justify-content-center align-content-center">
            <input
              className=" border-2 shadow-lg"
              type="checkbox"
                onChange={(e) => {
                    setAgreeToLaunch(e.target.value);
                }}
                value={agreeToLaunch}
            />
            <label className="form-check-label" for="flexCheckDefault">
              I agree the following...
            </label>
          </div>
        </div>
        <hr />
        <p className="text-center">
          {/* <p>"Read and agree the consent first"</p> */}
          <div dangerouslySetInnerHTML={{ __html: userConsent?.desciption }} />
        </p>
      </div>
    </>
  );
};

export default DisplayUserConsent;
