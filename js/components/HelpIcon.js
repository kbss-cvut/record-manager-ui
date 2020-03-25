'use strict';

import React from 'react';
import {Glyphicon, OverlayTrigger, Tooltip} from 'react-bootstrap';
import PropTypes from "prop-types";

const HelpIcon = (props) => {
    const tooltip = <Tooltip id='help-tooltip'>{props.text}</Tooltip>;

    return <OverlayTrigger placement='right' overlay={tooltip}>
        <Glyphicon glyph={props.glyph ? props.glyph : 'question-sign'} className='help-icon'/>
    </OverlayTrigger>;
};

HelpIcon.propTypes = {
    text: PropTypes.string.isRequired,
    glyph: PropTypes.string
};

export default HelpIcon;
