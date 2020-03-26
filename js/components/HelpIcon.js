'use strict';

import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import PropTypes from "prop-types";
import {FaQuestionCircle} from 'react-icons/fa';

const HelpIcon = (props) => {
    const tooltip = <Tooltip id='help-tooltip'>{props.text}</Tooltip>;

    return <OverlayTrigger placement='right' overlay={tooltip}>
        <FaQuestionCircle className='help-icon'/>
    </OverlayTrigger>;
};

HelpIcon.propTypes = {
    text: PropTypes.string.isRequired,
    glyph: PropTypes.string
};

export default HelpIcon;
