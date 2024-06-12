import React, { forwardRef } from "react";
import { Col, FormCheck, FormControl, FormGroup, FormLabel, FormText, InputGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import TypeaheadAnswer from "./record/TypeaheadAnswer";

const HorizontalInput = (props, ref) => {
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
      case "autocomplete":
        return renderAutocomplete();
      default:
        return renderInput();
    }
  };

  const getInputProps = () => {
    const newInputProps = { ...props };

    delete newInputProps.inputOffset;
    delete newInputProps.inputWidth;
    delete newInputProps.labelWidth;
    delete newInputProps.help;
    delete newInputProps.validation;
    delete newInputProps.iconRight;

    return newInputProps;
  };

  const renderCheckbox = () => {
    return (
      <FormGroup as={Row}>
        <Col lgOffset={props.inputOffset} lg={props.inputWidth}>
          <FormCheck type="checkbox" ref={ref} {...getInputProps()}>
            {props.label}
          </FormCheck>
        </Col>
      </FormGroup>
    );
  };

  const renderRadio = () => {
    return (
      <FormGroup as={Row}>
        <Col lgOffset={props.inputOffset} lg={props.inputWidth}>
          <FormCheck type="radio" ref={ref} {...getInputProps()}>
            {props.label}
          </FormCheck>
        </Col>
      </FormGroup>
    );
  };

  const renderSelect = () => {
    // TODO validation
    return (
      <FormGroup as={Row}>
        {renderLabel()}
        <Col lg={props.inputWidth}>
          <FormControl as="select" ref={ref} {...getInputProps()}>
            {props.children}
          </FormControl>
          {props.validation && <FormControl.Feedback />}
          {renderHelp()}
        </Col>
      </FormGroup>
    );
  };

  const renderAutocomplete = () => {
    // TODO validation
    return (
      <FormGroup as={Row}>
        {renderLabel()}
        <Col lg={props.inputWidth}>
          <TypeaheadAnswer {...getInputProps()} />
          {props.validation && <FormControl.Feedback />}
          {renderHelp()}
        </Col>
      </FormGroup>
    );
  };

  const renderLabel = () => {
    return props.label ? (
      <Col as={FormLabel} lg={props.labelWidth} className="font-weight-bold text-lg-right align-self-center">
        {props.label}
      </Col>
    ) : null;
  };

  const renderTextArea = () => {
    // TODO validation
    return (
      <FormGroup as={Row}>
        {renderLabel()}
        <Col lg={props.inputWidth}>
          <FormControl as="textarea" style={{ height: "auto" }} ref={ref} {...getInputProps()} />
          {props.validation && <FormControl.Feedback />}
          {renderHelp()}
        </Col>
      </FormGroup>
    );
  };

  const renderHelp = () => {
    return props.help ? <FormText>{props.help}</FormText> : null;
  };

  const renderInput = () => {
    // TODO validation
    const formControl = <FormControl ref={ref} as="input" {...getInputProps()} />;
    return (
      <FormGroup as={Row}>
        {renderLabel()}
        <Col lg={props.inputWidth}>
          {props.iconRight ? (
            <InputGroup>
              {formControl}
              <InputGroup.Append>
                <InputGroup.Text className="py-0">{props.iconRight}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          ) : (
            <div>
              {formControl}
              {props.validation && <FormControl.Feedback />}
              {renderHelp()}
            </div>
          )}
        </Col>
      </FormGroup>
    );
  };

  return renderInputOnType();
};

HorizontalInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  help: PropTypes.string,
  validation: PropTypes.oneOf(["success", "warning", "error"]),
  labelWidth: PropTypes.number, // Width of the label
  inputWidth: PropTypes.number, // Width of the input component container
  inputOffset: PropTypes.number, // Offset to put before the input component. Applicable only for
  possibleValueQuery: PropTypes.string,
  // checkboxes and radios
  iconRight: PropTypes.object,
  children: PropTypes.node,
};

HorizontalInput.defaultProps = {
  type: "text",
  labelWidth: 4,
  inputWidth: 9,
  inputOffset: 4,
};

export default forwardRef(HorizontalInput);
