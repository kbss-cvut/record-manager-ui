'use strict';

import React from 'react';
import {Alert, Button, ButtonToolbar, Card} from 'react-bootstrap';
import {Constants, HelpIcon} from 's-forms';
import JsonLdUtils from 'jsonld-utils';
import {injectIntl} from "react-intl";
import withI18n from '../../i18n/withI18n';
import PropTypes from "prop-types";
import {WizardContext} from '../../contexts/WizardContext';

class WizardStep extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            advanceDisabled: this.props.defaultNextDisabled != null ? this.props.defaultNextDisabled : false,
            retreatDisabled: false
        }
        this.generatedStep = React.createRef();
    }

    onAdvance = (err) => {
        if (err) {
            this.setState({
                advanceDisabled: false,
                retreatDisabled: false,
                currentError: err
            });
        } else {
            this.context.updateStepData(this.props.stepIndex, this.getStepData());
            this.props.onAdvance();
        }
    };

    getStepData = () => {
        return this.generatedStep.current.getData ? this.generatedStep.current.getData() : null;
    };

    onNext = () => {
        this.setState({
            advanceDisabled: true,
            retreatDisabled: true
        });

        if (this.props.onNext) {
            this.props.onNext.apply(this, [this.onAdvance]);
        } else {
            this.context.updateStepData(this.props.stepIndex, this.getStepData());
            this.props.onAdvance();
        }
    };

    onPrevious = () => {
        if (this.props.onPrevious) {
            this.props.onPrevious.apply(this, [this.props.onRetreat]);
        } else {
            this.props.onRetreat();
        }
    };

    onFinish = () => {
        this.context.updateStepData(this.props.stepIndex, this.getStepData());
        this.props.onFinish();
    };

    enableNext = () => this.setState({advanceDisabled: false});

    disableNext = () => {
        this.setState({advanceDisabled: true})
    };

    render() {
        return (
            <div className='wizard-step'>
                <Card
                    variant='primary'
                    className='wizard-step-content'
                >
                    <Card.Header className="text-light bg-primary" as="h6">
                        {this.props.title}{this._renderHelpIcon()}
                    </Card.Header>
                    <Card.Body>
                        {this.renderComponent()}
                    </Card.Body>
                </Card>

                <ButtonToolbar className="m-3 float-right">
                    {!this.props.isFirstStep &&
                    <Button className="mr-2" onClick={this.onPrevious} disabled={this.state.retreatDisabled}
                            variant='primary'
                            size='sm'>{this.i18n('wizard.previous')}</Button>}
                    {this.renderAdvanceButton()}
                </ButtonToolbar>
                {this.state.currentError &&
                <Alert variant='danger'><p>{this.state.currentError.message}</p></Alert>}
            </div>
        );
    };

    _renderHelpIcon = () => {
        const question = this.context.getStepData([this.props.stepIndex]);

        return question[Constants.HELP_DESCRIPTION] ?
            <HelpIcon text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], this.props.intl)}
                      iconClass='help-icon-section'/> : null;
    };

    renderAdvanceButton = () => {
        const disabledTitle = this.state.advanceDisabled ? this.i18n('wizard.advance-disabled-tooltip') : null;

        if (!this.props.isLastStep) {
            return <Button
                onClick={this.onNext} disabled={this.state.advanceDisabled} variant='primary'
                size='sm'
                title={disabledTitle}>{this.i18n('wizard.next')}</Button>;
        }
        return null;
    };

    renderComponent = () => {
        const PropsComponent = this.props.component;

        return <PropsComponent
            ref={this.generatedStep}
            stepIndex={this.props.stepIndex}
            getStepData={this.context.getStepData}
            updateStepData={this.context.updateStepData}
        />
    }
}

WizardStep.propTypes = {
    onClose: PropTypes.func,
    onFinish: PropTypes.func.isRequired,
    onAdvance: PropTypes.func,
    onRetreat: PropTypes.func,
    onNext: PropTypes.func,
    onPrevious: PropTypes.func,
    title: PropTypes.string,
    stepIndex: PropTypes.number.isRequired,
    isFirstStep: PropTypes.bool,
    isLastStep: PropTypes.bool,
    defaultNextDisabled: PropTypes.bool
};

WizardStep.contextType = WizardContext;

export default injectIntl(withI18n(WizardStep));
