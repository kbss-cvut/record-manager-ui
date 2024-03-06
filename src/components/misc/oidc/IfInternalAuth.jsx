import React from "react";
import { isUsingOidcAuth } from "../../../utils/OidcUtils";
import PropTypes from "prop-types";

const IfInternalAuth = ({ children }) => {
  if (isUsingOidcAuth()) {
    return null;
  }
  return <>{children}</>;
};

IfInternalAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IfInternalAuth;
