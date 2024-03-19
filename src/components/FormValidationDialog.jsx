import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { Constants as SConstants } from "@kbss-cvut/s-forms";

const FormValidationDialog = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleOnCloseModal} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalMessage}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.questionsToShow.map((questionValidator, index) => {
          return (
            <li key={index}>
              {questionValidator[SConstants.RDFS_LABEL] + " : " + questionValidator[SConstants.HAS_VALIDATION_MESSAGE]}
            </li>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.handleOnCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

FormValidationDialog.propTypes = {
  show: PropTypes.any,
  modalMessage: PropTypes.string,
  questionsToShow: PropTypes.any,
  handleOnCloseModal: PropTypes.func,
};

export default FormValidationDialog;
