'use strict';

import React from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";

//TODO add "disabled" to VerticalWizardNav
const VerticalWizardNav = ({steps, onNavigate, currentStep}) => (
    <div className="wizard-nav col-xs-2">
        <ListGroup>
            {steps.map((step, index) =>
                <ListGroupItem
                    key={'nav' + index} onClick={() => onNavigate(index)}
                    id={'wizard-nav-' + index}
                    active={index === currentStep ? 'active' : ''}>{step.name}</ListGroupItem>
            )}
        </ListGroup>
    </div>
);

VerticalWizardNav.propTypes = {
    currentStep: React.PropTypes.number.isRequired,
    steps: React.PropTypes.array.isRequired,
    onNavigate: React.PropTypes.func.isRequired
};

export default VerticalWizardNav;
