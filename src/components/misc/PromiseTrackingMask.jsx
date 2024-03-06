import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import { ContainerLoaderMask, LoaderMask } from "../Loader";
import PropTypes from "prop-types";

const PromiseTrackingMask = ({ area, coverViewport }) => {
  const { promiseInProgress } = usePromiseTracker({ area });

  return <>{promiseInProgress && (area && !coverViewport ? <ContainerLoaderMask /> : <LoaderMask />)}</>;
};

PromiseTrackingMask.propTypes = {
  area: PropTypes.string.isRequired,
  coverViewport: PropTypes.bool.isRequired,
};

PromiseTrackingMask.defaultProps = {
  coverViewport: false,
};

export default PromiseTrackingMask;
