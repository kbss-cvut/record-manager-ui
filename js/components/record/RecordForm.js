'use strict';

import React from 'react';
import SForms, {Constants} from '@kbss-cvut/s-forms';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import withI18n from '../../i18n/withI18n';
import Loader from "../Loader";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {axiosBackend} from "../../actions";
import {API_URL} from "../../../config";
import * as Logger from "../../utils/Logger";
import * as I18nStore from "../../stores/I18nStore";
// TODO enable s-forms-components
// import SmartComponents from "s-forms-components";

import "@kbss-cvut/s-forms/dist/s-forms.css";
// import 's-forms-components/dist/s-forms-components.css'
import 'react-datepicker/dist/react-datepicker.css';
// import "intelligent-tree-select/lib/styles.css"

// const componentMapping = SmartComponents.getComponentMapping();

class RecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            wizardProperties: null,
            form: null
        }
        this.refForm = React.createRef();
    }

    componentDidMount() {
        if(this.props.record.formTemplate) {
            this.props.loadFormgen(ACTION_STATUS.PENDING);
            this.loadWizard();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {record} = this.props;
        if(record.formTemplate && record.formTemplate != prevProps.record.formTemplate) {
            this.props.loadFormgen(ACTION_STATUS.PENDING);
            this.loadWizard();
        }
    }

    async loadWizard() {
        try {
            const response = await axiosBackend.post(`${API_URL}/rest/formGen`, this.props.record);
            this.props.loadFormgen(ACTION_STATUS.SUCCESS);
            this.setState({form: response.data})
        } catch (error) {
            Logger.error('Received no valid wizard.');
            this.props.loadFormgen(ACTION_STATUS.ERROR, error);
        }
    }

    getFormData = () => {
        return this.refForm.current.getFormData();
    };

    fetchTypeAheadValues = async (query) => {
        const FORM_GEN_POSSIBLE_VALUES_URL = `${API_URL}/rest/formGen/possibleValues`;

        const result = await axiosBackend.get(`${FORM_GEN_POSSIBLE_VALUES_URL}?query=${encodeURIComponent(query)}`);
        return result.data;
    }

    _getUsersOptions() {
        const currentUser = this.props.currentUser;
        return {
            users: [
                {id: currentUser.uri, label: currentUser.firstName + " " + currentUser.lastName}
            ],
            currentUser: currentUser.uri
        };
    }

    _isDevGroupUser() {
        return this.props.currentUser.emailAddress.includes("devgroup");
    }

    _getIconsOptions() {
        if (this._isDevGroupUser()) {
            return {
                icons: [
                    {id: Constants.ICONS.QUESTION_HELP, behavior: Constants.ICON_BEHAVIOR.ON_HOVER},
                    {id: Constants.ICONS.QUESTION_LINK, behavior: Constants.ICON_BEHAVIOR.ON_HOVER},
                    {id: Constants.ICONS.QUESTION_COMMENTS, behavior: Constants.ICON_BEHAVIOR.ON_HOVER}
                ]
            };
        }

        return {
            icons: [
                {id: Constants.ICONS.QUESTION_HELP, behavior: Constants.ICON_BEHAVIOR.ON_HOVER}
            ]
        };
    }


    render() {
        const i18n = {
            'wizard.next': this.i18n('wizard.next'),
            'wizard.previous': this.i18n('wizard.previous'),
            "section.expand": this.i18n('section.expand'),
            "section.collapse": this.i18n('section.collapse'),
        }
        const options = {
            i18n,
            intl: I18nStore.getIntl(),
            ...this._getUsersOptions(),
            ...this._getIconsOptions()
        }

        if (this.props.formgen.status === ACTION_STATUS.ERROR) {
            return <AlertMessage
                type={ALERT_TYPES.DANGER}
                message={this.props.formatMessage('record.load-form-error', {error: this.props.formgen.error.message})}/>;
        } else if (!!this.props.record.formTemplate && (this.props.formgen.status === ACTION_STATUS.PENDING || !this.state.form)) {
            return <Loader/>;
        }

        return !!this.state.form && <SForms
            ref={this.refForm}
            form={this.state.form}
            formData={this.props.record.question}
            options={options}
            fetchTypeAheadValues={this.fetchTypeAheadValues}
            isFormValid={this.props.isFormValid}
            enableForwardSkip={true}
            loader={<Loader/>}
            // componentMapRules={componentMapping}
        />;
    }
}

RecordForm.propTypes = {
    record: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    loadFormgen: PropTypes.func,
    formgen: PropTypes.object,
    isFormValid: PropTypes.func
};

export default injectIntl(withI18n(RecordForm, {forwardRef: true}), {forwardRef: true});
