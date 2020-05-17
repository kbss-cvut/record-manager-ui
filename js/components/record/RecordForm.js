'use strict';

import React from 'react';
import {Card} from 'react-bootstrap';
import {WizardContainer} from 's-forms';
import withI18n from '../../i18n/withI18n';
import {injectIntl} from "react-intl";
import * as WizardBuilder from '../wizard/generator/WizardBuilder';
import Loader from "../Loader";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import PropTypes from "prop-types";

class RecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            wizardProperties: null,
            form: null
        }
        this.form = React.createRef();
    }

    componentDidMount() {
        this.props.loadFormgen(ACTION_STATUS.PENDING);
        this.loadWizard();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {record} = this.props;

        if (prevProps.record.question !== record.question) {
            this.loadWizard();
        }
    }

    async loadWizard() {
        try {
            const [wizardProperties, form] = await WizardBuilder.generateWizard(this.props.record);

            this.props.loadFormgen(ACTION_STATUS.SUCCESS);

            if (wizardProperties && wizardProperties.steps && wizardProperties.steps.length > 0) {
                wizardProperties.steps[0].visited = true;
            }

            this.setState({wizardProperties, form});
        } catch (error) {
            this.props.loadFormgen(ACTION_STATUS.ERROR, error);
        }
    }

    getFormData = () => {
        return this.form.current.getFormData();
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
            {this.props.formgen.status === ACTION_STATUS.ERROR ?
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('institution.save-success')}/>
                : this.props.formgen.status === ACTION_STATUS.PENDING || !this.state.wizardProperties ? <Loader/>
                    : <WizardContainer
                        ref={this.form} steps={this.state.wizardProperties.steps} enableForwardSkip={true}
                        data={this.state.form}/>}
        </Card>;
    }
}

RecordForm.propTypes = {
    record: PropTypes.object.isRequired,
    loadFormgen: PropTypes.func,
    formgen: PropTypes.object
};

export default injectIntl(withI18n(RecordForm, {forwardRef: true}), {forwardRef: true});
