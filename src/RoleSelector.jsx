import React, { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { ROLE } from "./constants/DefaultConstants.js";
import Row from "react-bootstrap/Row";
import { Col, FormGroup, FormLabel } from "react-bootstrap";

const roleOptions = Object.keys(ROLE).map((key) => ({
  value: ROLE[key],
  label: ROLE[key],
}));

const RoleSelector = ({ selected = [], handler = () => {}, readOnly = true, label = "Roles" }) => {
  const formatSelected = (selected) => {
    return selected.map((value) => ({
      value: value,
      label: value,
    }));
  };

  return (
    <FormGroup as={Row} className="mb-3">
      <FormLabel column lg={3} className="fw-bold text-lg-end align-self-center">
        {label}
      </FormLabel>
      <Col lg={8}>
        <Select
          value={formatSelected(selected)}
          isMulti
          name="roles"
          onChange={handler}
          options={roleOptions}
          isDisabled={readOnly}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </Col>
    </FormGroup>
  );
};

RoleSelector.propTypes = {
  selected: PropTypes.array,
  handler: PropTypes.func,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
};

export default RoleSelector;
