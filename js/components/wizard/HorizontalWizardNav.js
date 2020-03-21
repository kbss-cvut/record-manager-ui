'use strict';

import React from "react";
import {Nav, NavItem} from "react-bootstrap";
import {FormUtils} from "s-forms";

const HorizontalWizardNav = ({steps, onNavigate, currentStep}) => (
    <div className="wizard-nav">
        <Nav bsStyle="tabs" onSelect={(key) => onNavigate(key)}>
            {steps.map((step, index) =>
                <NavItem
                    key={'nav' + index} eventKey={index}
                    id={'wizard-nav-' + index}
                    active={index === currentStep}
                    disabled={!FormUtils.isRelevant(step.data)}>{step.name}</NavItem>
            )}
        </Nav>
    </div>
);

HorizontalWizardNav.propTypes = {
    currentStep: React.PropTypes.number.isRequired,
    steps: React.PropTypes.array.isRequired,
    onNavigate: React.PropTypes.func.isRequired
};


export default HorizontalWizardNav;
