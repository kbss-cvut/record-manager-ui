import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Button, Modal, Form } from "react-bootstrap";
import { useI18n } from "../../hooks/useI18n.jsx";
import { useDispatch, useSelector } from "react-redux";
import { loadAllowedRejectMessage } from "../../actions/RecordsActions.js";
import "bootstrap/dist/css/bootstrap.min.css";

const RejectButton = ({
  children,
  className = "",
  variant = "danger",
  size = "sm",
  disabled = true,
  onClick = () => {},
}) => {
  const { i18n } = useI18n();
  const dispatch = useDispatch();
  const isAllowedRejectMessage = useSelector((state) => state.records.isAllowedRejectMessage.data);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    dispatch(loadAllowedRejectMessage());
  }, [dispatch]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleInputChange = (event) => setRejectionReason(event.target.value);
  const handleReject = () => {
    setShowModal(false);
    onClick(rejectionReason);
  };

  return (
    <>
      {isAllowedRejectMessage ? (
        <Button className={className} size={size} disabled={disabled} variant={variant} onClick={handleShow}>
          {children}
        </Button>
      ) : (
        <Button className={className} size={size} disabled={disabled} variant={variant} onClick={onClick}>
          {children}
        </Button>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header className="bg-warning">
          <Modal.Title className="h5">{i18n("reject-dialog-title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRejectionReason">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={i18n("records.rejection-reason-placeholder")}
                value={rejectionReason}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {i18n("close")}
          </Button>
          <Button variant="danger" onClick={handleReject}>
            {i18n("reject")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

RejectButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default RejectButton;
