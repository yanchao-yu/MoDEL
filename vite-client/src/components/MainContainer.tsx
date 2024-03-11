import PropTypes from "prop-types";

function MainContainer({ component }) {

  return component ? (
    <div
      className={`h-100 border rounded max-w-100 w-100`}
    >
      {component}
    </div>
  ) : (
    ""
  );
}

MainContainer.propTypes = {
  component: PropTypes.any,
};

export default MainContainer;
