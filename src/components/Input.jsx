"use strict";

import React, { forwardRef } from "react";
import { FormLabel, FormGroup, FormControl, FormText, FormCheck } from "react-bootstrap";
import PropTypes from "prop-types";

const Input = forwardRef(function InputWithRef(props, ref) {
  const renderInputOnType = () => {
    switch (props.type) {
      case "radio":
        return renderRadio();
      case "checkbox":
        return renderCheckbox();
      case "select":
        return renderSelect();
      case "textarea":
        return renderTextArea();
      default:
        return renderInput();
    }
  };

  const renderCheckbox = () => {
    return (
      <FormCheck ref={ref} {...props}>
        {props.label}
      </FormCheck>
    );
  };

  const renderRadio = () => {
    return (
      <FormCheck ref={ref} {...props}>
        {props.label}
      </FormCheck>
    );
  };

  const renderSelect = () => {
    return (
      <FormGroup size="sm">
        {renderLabel()}
        <FormControl as="select" {...props}>
          {props.children}
        </FormControl>
        {props.validation && <FormControl.Feedback />}
        {renderHelp()}
      </FormGroup>
    );
  };

  const renderLabel = () => {
    return props.label ? <FormLabel>{props.label}</FormLabel> : null;
  };

  const renderTextArea = () => {
    return (
      <FormGroup size="sm">
        {renderLabel()}
        <FormControl as="textarea" style={{ height: "auto" }} ref={props} {...props} />
        {props.validation && <FormControl.Feedback />}
        {renderHelp()}
      </FormGroup>
    );
  };

  const renderHelp = () => {
    return props.help ? <FormText>{props.help}</FormText> : null;
  };

  const renderInput = () => {
    return (
      <FormGroup size="sm">
        {renderLabel()}
        <FormControl ref={ref} as="input" {...props} />
        {props.validation && <FormControl.Feedback />}
        {renderHelp()}
      </FormGroup>
    );
  };

  return renderInputOnType();
});

Input.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  help: PropTypes.string,
  validation: PropTypes.oneOf(["success", "warning", "error"]),
};

Input.defaultProps = {
  type: "text",
};

export default Input;
