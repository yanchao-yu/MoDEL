import PropTypes from "prop-types";
import AsideTopContainer from "./AsideTopContainer";
import AsideBottomContainer from "./AsideBottomContainer";
import { useContext } from "react";
import { ConfigContext } from "../app/configContext";

function AsideContent({ topComponent, bottomComponent }) {
  const { selectedChatOption } = useContext(ConfigContext);

  return (
    <div
      className={`h-100 d-flex  max-w-100  gap-2 ${
        selectedChatOption && topComponent && bottomComponent
          ? "flex-row"
          : "flex-column"
      }  justify-content-between`}
    >
      {topComponent && <AsideTopContainer component={topComponent} />}
      {bottomComponent && <AsideBottomContainer component={bottomComponent} />}
    </div>
  );
}

AsideContent.propTypes = {
  bottomComponent: PropTypes.any,
  topComponent: PropTypes.any,
};

export default AsideContent;
