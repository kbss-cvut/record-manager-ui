'use strict';

import React from 'react';
import {injectIntl, FormattedMessage} from "react-intl";
import {Button, Modal} from 'react-bootstrap';
import PropTypes from "prop-types";

import withI18n from '../i18n/withI18n';

const DeleteItemDialog = (props) => {
    if (!props.item) {
        return null;
    }
    return <Modal show={props.show} onHide={props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                {props.i18n('delete.dialog-title')}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormattedMessage id='delete.dialog-content'
                              values={{itemLabel: props.itemLabel}}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='warning' size='sm'
                    onClick={props.onSubmit}>{props.i18n('delete')}</Button>
            <Button size='sm' onClick={props.onClose}>{props.i18n('cancel')}</Button>
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

export default injectIntl(withI18n(DeleteItemDialog));
