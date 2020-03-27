'use strict';

import React from 'react';
import {Card} from 'react-bootstrap';
// import {QuestionAnswerProcessor} from 's-forms';
import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import Wizard from '../wizard/Wizard';
import * as WizardBuilder from '../wizard/generator/WizardBuilder';
import {WizardStoreInstance} from '../wizard/generator/WizardBuilder';
import Loader from "../Loader";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import PropTypes from "prop-types";

class RecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            wizardProperties: null
        }
    }

    componentDidMount() {
        this.props.loadFormgen(ACTION_STATUS.PENDING);
        WizardBuilder.generateWizard(this.props.record, this.onWizardReady, this.onWizardError);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {record} = this.props;

        if (prevProps.record.question !== record.question) {
            this.setState({wizardProperties: null});
            WizardBuilder.generateWizard(record, this.onWizardReady, this.onWizardError);
        }
    }

    onWizardReady = (wizardProperties) => {
        const {loadFormgen} = this.props;

        loadFormgen(ACTION_STATUS.SUCCESS);

        if (wizardProperties && wizardProperties.steps && wizardProperties.steps.length > 0) {
            wizardProperties.steps[0].visited = true;
        }

        this.setState({wizardProperties: wizardProperties});
    };

    onWizardError = (error) => {
        this.props.loadFormgen(ACTION_STATUS.ERROR, error);
    };

    getFormData = () => {
        // return QuestionAnswerProcessor.buildQuestionAnswerModel(WizardStoreInstance.getData(), WizardStoreInstance.getStepData());
    };

    render() {
        if (this.props.formgen.status === ACTION_STATUS.ERROR) {
            return <AlertMessage
                type={ALERT_TYPES.DANGER}
                message={this.props.formatMessage('record.load-form-error', {error: this.props.formgen.error.message})}/>;
        } else if (this.props.formgen.status === ACTION_STATUS.PENDING || !this.state.wizardProperties) {
            return <Loader/>;
        }

        return <Card variant='info'>
            <Card.Header className="text-light bg-primary" as="h6">{this.i18n('record.form-title')}</Card.Header>
            <Card.Body>
                {this.props.formgen.status === ACTION_STATUS.ERROR ?
                    <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('institution.save-success')}/>
                    : this.props.formgen.status === ACTION_STATUS.PENDING || !this.state.wizardProperties ? <Loader/>
                        : <Wizard steps={this.state.wizardProperties.steps} enableForwardSkip={true}/>}
            </Card.Body>
        </Card>;
    }
}

RecordForm.propTypes = {
    record: PropTypes.object.isRequired,
    loadFormgen: PropTypes.func,
    formgen: PropTypes.object
};

export default injectIntl(I18nWrapper(RecordForm), {withRef: true});
