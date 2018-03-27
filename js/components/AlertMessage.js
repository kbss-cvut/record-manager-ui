import React from 'react';
import {Alert} from "react-bootstrap";

const AlertMessage = (props) => (
    <div className='message-container'>
        <Alert bsStyle={props.type}>
            <p>{props.message}</p>
        </Alert>
    </div>
);

AlertMessage.propTypes = {
    type: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
};

export default AlertMessage;
