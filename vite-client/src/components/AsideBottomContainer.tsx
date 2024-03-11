import PropTypes from "prop-types";
import { ConfigContext } from "../app/configContext";
import { useContext } from "react";

function AsideBottomContainer({ component }) {
  const { selectedChatOption } = useContext(ConfigContext);

  return (
    <div
      className={`border rounded h-100 max-w-100 w-100 `}
      style={{ maxHeight: selectedChatOption ? "100%" : "42vh" }}
    >
      {component}
    </div>
  );
}

AsideBottomContainer.propTypes = {
  component: PropTypes.any,
};

export default AsideBottomContainer;
