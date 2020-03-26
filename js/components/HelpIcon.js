'use strict';

import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import PropTypes from "prop-types";
import {FaQuestionCircle} from 'react-icons/fa';
import {FaCheck} from 'react-icons/fa';
import {FaTimes} from 'react-icons/fa';

const HelpIcon = (props) => {
    const tooltip = <Tooltip id='help-tooltip'>{props.text}</Tooltip>;

    const icon = () => {
        switch (props.glyph) {
            case "help":
                return <FaQuestionCircle className={'help-icon ' + props.className}/>;
            case "ok":
                return <FaCheck className={'ok-icon ' + props.className}/>;
            case "remove":
                return <FaTimes className={'remove-icon ' + props.className}/>;
            default:
                return null;
        }
    }


    return <OverlayTrigger placement='right' overlay={tooltip}>
        {icon()}
    </OverlayTrigger>;
};

HelpIcon.propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    glyph: PropTypes.string
};

export default HelpIcon;
