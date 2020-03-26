'use strict';

import React from 'react';
import {Alert, Button, ButtonToolbar, Card} from 'react-bootstrap';
// import {Constants, HelpIcon} from 's-forms';
import JsonLdUtils from 'jsonld-utils';
import injectIntl from '../../utils/injectIntl';
import {WizardStoreInstance} from '../wizard/generator/WizardBuilder';
import I18nWrapper from '../../i18n/I18nWrapper';
import PropTypes from "prop-types";

class WizardStep extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            advanceDisabled: this.props.defaultNextDisabled != null ? this.props.defaultNextDisabled : false,
            retreatDisabled: false
        }
    }

    onAdvance = (err) => {
        if (err) {
            this.setState({
                advanceDisabled: false,
                retreatDisabled: false,
                currentError: err
            });
        } else {
            WizardStoreInstance.updateStepData(this.props.stepIndex, this.getStepData());
            this.props.onAdvance();
        }
    };

    getStepData = () => {
        return this.refs.component.getData ? this.refs.component.getData() : null;
    };

    onNext = () => {
        this.setState({
            advanceDisabled: true,
            retreatDisabled: true
        });

        if (this.props.onNext) {
            this.props.onNext.apply(this, [this.onAdvance]);
        } else {
            WizardStoreInstance.updateStepData(this.props.stepIndex, this.getStepData());
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
        WizardStoreInstance.updateStepData(this.props.stepIndex, this.getStepData());
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
                    <Card.Header className="text-light bg-primary" as="h4">
                        {this.props.title}{this._renderHelpIcon()}
                    </Card.Header>
                    <Card.Body>
                    {this.renderComponent()}
                    </Card.Body>
                </Card>

                <ButtonToolbar style={{float: 'right'}}>
                    {!this.props.isFirstStep &&
                    <Button onClick={this.onPrevious} disabled={this.state.retreatDisabled} variant='primary'
                            size='sm'>{this.i18n('wizard.previous')}</Button>}
                    {this.renderAdvanceButton()}
                </ButtonToolbar>
                {this.state.currentError &&
                <Alert variant='danger'><p>{this.state.currentError.message}</p></Alert>}
            </div>
        );
    };

    _renderHelpIcon = () => {
        const question = WizardStoreInstance.getStepData([this.props.stepIndex]);
        /*
                return question[Constants.HELP_DESCRIPTION] ?
                    <HelpIcon text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], this.props.intl)}
                              iconClass='help-icon-section'/> : null; */
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
            ref='component'
            stepIndex={this.props.stepIndex}
            enableNext={this.enableNext}
            disableNext={this.disableNext}
            next={this.onNext}
            previous={this.onPrevious}
            finish={this.onFinish}
            insertStepAfterCurrent={this.props.onInsertStepAfterCurrent}
            addStep={this.props.onAddStep}
            removeStep={this.props.onRemoveStep}/>
    }
}

WizardStep
    .propTypes = {
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

export default injectIntl(I18nWrapper(WizardStep));
