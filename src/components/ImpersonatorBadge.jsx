import React from "react";
import { useSelector } from "react-redux";
import { Badge } from "react-bootstrap";
import { useI18n } from "../hooks/useI18n";
import { isImpersonated } from "../utils/SecurityUtils.js";

const ImpersonatorBadge = () => {
  const { i18n } = useI18n();
  const user = useSelector((state) => state.auth.user);
  if (isImpersonated(user)) {
    return (
      <Badge variant="warning" className="nav-badge">
        {i18n("main.impersonating")}
      </Badge>
    );
  }
  return null;
};

export default ImpersonatorBadge;
