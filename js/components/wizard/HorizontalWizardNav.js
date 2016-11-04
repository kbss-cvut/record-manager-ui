'use strict';

import React from "react";
import {Nav, NavItem} from "react-bootstrap";


const HorizontalWizardNav = (props) => {

    var navMenu = props.steps.map((step, index) => {
        return <NavItem key={'nav' + index} eventKey={'nav' + index} onClick={() => props.onNavigate(index)}
                        id={'wizard-nav-' + index}
                        active={index === props.currentStep}>{step.name}</NavItem>;
    });

    return <div className="wizard-nav">
        <Nav bsStyle="tabs">
            {navMenu}
        </Nav>
    </div>;
};

HorizontalWizardNav.propTypes = {
    currentStep: React.PropTypes.number.isRequired,
    steps: React.PropTypes.array.isRequired,
    onNavigate: React.PropTypes.func.isRequired
};


export default HorizontalWizardNav;
