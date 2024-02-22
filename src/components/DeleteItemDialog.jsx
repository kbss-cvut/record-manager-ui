import React from 'react';
import {FormattedMessage} from "react-intl";
import {Button, Modal} from 'react-bootstrap';
import PropTypes from "prop-types";
import {useI18n} from "../hooks/useI18n";

const DeleteItemDialog = (props) => {
    const {i18n} = useI18n();
    if (!props.item) {
        return null;
    }
    return <Modal show={props.show} onHide={props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                {i18n('delete.dialog-title')}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormattedMessage id='delete.dialog-content'
                              values={{itemLabel: props.itemLabel}}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='warning' size='sm' className="action-button"
                    onClick={props.onSubmit}>{i18n('delete')}</Button>
            <Button size='sm' className="action-button" onClick={props.onClose}>{i18n('cancel')}</Button>
        </Modal.Footer>
    </Modal>
};

DeleteItemDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    item: PropTypes.object,
    itemLabel: PropTypes.string
};

export default DeleteItemDialog;
