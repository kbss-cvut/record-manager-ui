'use strict';

import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import PropTypes from "prop-types";

import injectIntl from '../utils/injectIntl';
import I18nWrapper from '../i18n/I18nWrapper';

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
            <Button bsStyle='warning' bsSize='small'
                    onClick={props.onSubmit}>{props.i18n('delete')}</Button>
            <Button bsSize='small' onClick={props.onClose}>{props.i18n('cancel')}</Button>
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

export default injectIntl(I18nWrapper(DeleteItemDialog));
