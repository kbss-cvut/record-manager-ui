'use strict';

import React from 'react';
import {Modal} from 'react-bootstrap';
import Wizard from './Wizard';

const WizardWindow = (props) => {

    const properties = {...props, onClose: props.onHide};

    const getModalProps = () => {
        const modalProps = {...props};

        delete modalProps.steps;
        delete modalProps.onFinish;
        delete modalProps.start;
        delete modalProps.enableForwardSkip;

        return modalProps;
    };

    return <Modal {...getModalProps()} show={show} bsSize="large" title={props.title}
                  animation={true} dialogClassName="large-modal">
        <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <div className="modal-body" style={{overflow: 'hidden'}}>
            <Wizard {...properties}/>
        </div>
    </Modal>
};

WizardWindow.propTypes = {
    onHide: React.PropTypes.func,
    title: React.PropTypes.string,
    show: React.PropTypes.bool
};