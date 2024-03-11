import PropTypes from "prop-types";
import { useContext } from "react";
import { ConfigContext } from "../app/configContext";

function AsideTopContainer({ component }) {
  const { selectedChatOption } = useContext(ConfigContext);

  // console.log("component", component.type.name )
  return (
    <div
      className={`border rounded h-100 max-w-100 w-100`}
      style={{
        maxHeight: selectedChatOption ? "100%" : "42vh",
      }}
    >
      {component}
    </div>
  );
}

AsideTopContainer.propTypes = {
  component: PropTypes.any,
};

export default AsideTopContainer;
