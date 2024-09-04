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

const RoleSelector = ({ selected = [], handler, readOnly = true, label = "Roles" }) => {
  const formatSelected = (selected) => {
    return selected.map((value) => ({
      value: value,
      label: value,
    }));
  };

  const [selectedRoles, setSelectedRoles] = useState(formatSelected(selected));

  useEffect(() => {
    setSelectedRoles(formatSelected(selected));
  }, [selected]);

  const handleChange = (selectedOptions) => {
    setSelectedRoles(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    handler(selectedValues);
  };

  return (
    <FormGroup as={Row}>
      <Col as={FormLabel} lg={2} className="font-weight-bold text-lg-right align-self-center">
        {label}
      </Col>
      <Col lg={10}>
        <Select
          value={selectedRoles}
          onChange={handleChange}
          isMulti
          name="roles"
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
  handler: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
};

export default RoleSelector;
