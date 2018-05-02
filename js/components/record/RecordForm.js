'use strict';

import React from 'react';
import {Panel} from 'react-bootstrap';
import {QuestionAnswerProcessor} from 'semforms';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import Wizard from '../wizard/Wizard';
import WizardBuilder from '../wizard/generator/WizardBuilder';
import WizardStore from '../../stores/WizardStore';
import Loader from "../Loader";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";

class RecordForm extends React.Component {
    static propTypes = {
        record: React.PropTypes.object.isRequired,
        loadFormgen: React.PropTypes.func,
        formgen: React.PropTypes.object
    };

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

    componentWillReceiveProps(nextProps) {
        if (this.props.record.question !== nextProps.record.question) {
            // this.setState({wizardProperties: null});
            WizardBuilder.generateWizard(nextProps.record, this.onWizardReady, this.onWizardError);
        }
    }

    onWizardReady = (wizardProperties) => {
        this.props.loadFormgen(ACTION_STATUS.SUCCESS);
        this.setState({wizardProperties: wizardProperties});
    };

    onWizardError = (error) => {
        this.props.loadFormgen(ACTION_STATUS.ERROR, error);
    };

    getFormData = () => {
        return QuestionAnswerProcessor.buildQuestionAnswerModel(WizardStore.getData(), WizardStore.getStepData());
    };

    render() {
        if (this.props.formgen.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                          message={this.props.formatMessage('record.load-form-error', {error: this.props.formgen.error.message})}/>;
        } else if (this.props.formgen.status === ACTION_STATUS.PENDING || !this.state.wizardProperties) {
            return <Loader />;
        }
        return <Panel header={<h5>{this.i18n('record.form-title')}</h5>} bsStyle='info'>
            {this.props.formgen.status === ACTION_STATUS.ERROR ?
            <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('institution.save-success')}/>
            : this.props.formgen.status === ACTION_STATUS.PENDING || !this.state.wizardProperties ? <Loader />
            : <Wizard steps={this.state.wizardProperties.steps} enableForwardSkip={true}/>}
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(RecordForm), {withRef: true});
