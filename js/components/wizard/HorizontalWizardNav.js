'use strict';

import React from "react";
import {Nav, NavItem} from "react-bootstrap";
// import {FormUtils} from "s-forms";
import PropTypes from "prop-types";

const HorizontalWizardNav = ({steps, onNavigate, currentStep}) => (
    <div className="wizard-nav">
        <Nav bsStyle="tabs" onSelect={(key) => onNavigate(key)}>
            {steps.map((step, index) =>
                <NavItem
                    key={'nav' + index} eventKey={index}
                    id={'wizard-nav-' + index}
                    active={index === currentStep}>{step.name}
                    {
                        // disabled={!FormUtils.isRelevant(step.data)}>
                    }
                </NavItem>
            )}
        </Nav>
    </div>
);

HorizontalWizardNav.propTypes = {
    currentStep: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    onNavigate: PropTypes.func.isRequired
};


export default HorizontalWizardNav;
