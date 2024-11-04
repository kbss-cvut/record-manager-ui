"use strict";

import React, { useRef, useState } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";
import { FaEnvelope, FaQuestionCircle, FaCheck, FaTimes, FaTasks } from "react-icons/fa";

const HelpIcon = (props) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

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
    <>
      <span ref={target} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="position-relative">
        {icon()}
      </span>
      <Overlay target={target.current} show={show} placement="right" onHide={handleMouseLeave}>
        {tooltip}
      </Overlay>
    </>
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
