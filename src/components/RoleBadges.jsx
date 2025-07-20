import React from "react";

import PropTypes from "prop-types";

import Row from "react-bootstrap/Row";
import { Col, FormGroup, FormLabel } from "react-bootstrap";

const RoleBadges = ({ roles, label = "Roles" }) => {
  return (
    <FormGroup as={Row} className="mb-3">
      <FormLabel column lg={3} className="fw-bold text-lg-end align-self-center">
        {label}
      </FormLabel>
      <Col lg={8}>
        <div style={{ padding: "6px 12px" }} className="d-flex flex-wrap border rounded">
          {roles && roles.length > 0 ? (
            roles.map((role, index) => (
              <span key={role} className={`badge bg-secondary text-white m-1`}>
                {role}
              </span>
            ))
          ) : (
            <span className="text-secondary">No roles selected</span>
          )}
        </div>
      </Col>
    </FormGroup>
  );
};

RoleBadges.propTypes = {
  roles: PropTypes.array,
  label: PropTypes.string,
};

export default RoleBadges;
