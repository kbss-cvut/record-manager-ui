import React from 'react';
import {Alert} from "react-bootstrap";
import PropTypes from "prop-types";

const AlertMessage = (props) => (
    <div className='message-container'>
        <Alert className={`alert-position-${props.alertPosition || 'down'}`} variant={props.type}>
            <p>{props.message}</p>
        </Alert>
    </div>
);

AlertMessage.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    alertPosition: PropTypes.string
};

export default AlertMessage;
