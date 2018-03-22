'use strict';

import React from 'react';
import {Panel} from 'react-bootstrap';
import {QuestionAnswerProcessor} from 'semforms';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import Mask from '../Mask';
import Wizard from '../wizard/Wizard';
import WizardBuilder from '../wizard/generator/WizardBuilder';
import WizardStore from '../../stores/WizardStore';
import Loader from "../Loader";

class RecordForm extends React.Component {
    static propTypes = {
        record: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            wizardProperties: null
        }
    }

    componentDidMount() {
        WizardBuilder.generateWizard(this.props.record, this.onWizardReady);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.question !== nextProps.record.question) {
            // this.setState({wizardProperties: null});
            WizardBuilder.generateWizard(nextProps.record, this.onWizardReady);
        }
    }

    onWizardReady = (wizardProperties) => {
        this.setState({wizardProperties: wizardProperties});
    };

    getFormData = () => {
        return QuestionAnswerProcessor.buildQuestionAnswerModel(WizardStore.getData(), WizardStore.getStepData());
    };

    render() {
        return <Panel header={<h5>{this.i18n('record.form-title')}</h5>} bsStyle='info'>
            {!this.state.wizardProperties ?
                <Loader />
                :
                <Wizard steps={this.state.wizardProperties.steps} enableForwardSkip={true}/>}
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(RecordForm), {withRef: true});
