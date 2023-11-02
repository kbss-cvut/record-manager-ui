import React from "react";
import {isUsingOidcAuth} from "../../../utils/OidcUtils";

const IfInternalAuth = ({ children }) => {
  if (isUsingOidcAuth()) {
    return null;
  }
  return <>{children}</>;
};

export default IfInternalAuth;
