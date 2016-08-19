'use strict';

import React from 'react';
import {Panel} from 'react-bootstrap';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import Wizard from '../wizard/Wizard';
import WizardGenerator from '../wizard/generator/WizardGenerator';

class RecordForm extends React.Component {
    static propTypes = {
        record: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            wizardProperties: null
        }
    }

    componentDidMount() {
        WizardGenerator.generateWizard(this.props.record, this.onWizardReady);
    }

    onWizardReady = (wizardProperties) => {
        this.setState({wizardProperties: wizardProperties});
    };

    render() {
        if (!this.state.wizardProperties) {
            return null;
        }
        var record = this.props.record;
        return <Panel header={<h5>{this.i18n('record.form-title')}</h5>} bsStyle='info'>
            <Wizard steps={this.state.wizardProperties} enableForwardSkip={true}/>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(RecordForm));
