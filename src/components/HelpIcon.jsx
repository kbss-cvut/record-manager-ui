"use strict";

import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";
import { FaEnvelope, FaQuestionCircle, FaCheck, FaTimes, FaTasks } from "react-icons/fa";

const HelpIcon = (props) => {
  const tooltip = <Tooltip id="help-tooltip">{props.text}</Tooltip>;

  const icon = () => {
    switch (props.glyph) {
      case "ok":
        return <FaCheck className={"ok-icon " + props.className} />;
      case "remove":
        return <FaTimes className={"remove-icon " + props.className} />;
      case "to-do":
        return <FaTasks className={"to-do-icon " + props.className} />;
      case "envelope":
        return <FaEnvelope className={"publish-icon " + props.className} />;
      default:
        return <FaQuestionCircle className={"help-icon " + props.className} />;
    }
  };

  return (
    <OverlayTrigger placement="right" overlay={tooltip}>
      <span className="position-relative">{icon()}</span>
    </OverlayTrigger>
  );
};

HelpIcon.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  glyph: PropTypes.string,
};

HelpIcon.defaultProps = {
  glyph: "help",
};

export default HelpIcon;
