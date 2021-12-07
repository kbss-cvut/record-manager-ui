'use strict';

import React from "react";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {FormattedMessage, injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import HorizontalInput from "../HorizontalInput";
import RecordForm from "./RecordForm";
import RecordProvenance from "./RecordProvenance";
import RequiredAttributes from "./RequiredAttributes";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderCard, LoaderSmall} from "../Loader";
import {processTypeaheadOptions} from "./TypeaheadAnswer";

class Record extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.recordForm = React.createRef();
        this.state = {
            isFormValid: false
        }
    }

    _onChange = (e) => {
        const change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    getFormData = () => {
        return this.recordForm.current.getFormData();
    };

    isFormValid = (isFormValid) => {
        this.setState({isFormValid})
    }

    render() {
        const {recordLoaded, recordSaved, showAlert, record, formTemplate, currentUser} = this.props;

        if (recordLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('record.load-error', {error: this.props.recordLoaded.error.message})}/>;
        }

        if (!record) {
            return <LoaderCard header={this._renderHeader()} variant='primary'/>;
        }

        return <div className={"record"}>
                <form>
                    <RequiredAttributes record={record} onChange={this._onChange}
                                        formTemplate={formTemplate}
                                        currentUser={currentUser}
                                        completed={record.state.isComplete()}/>
                    {this._showInstitution() && this._renderInstitution()}
                    <RecordProvenance record={record}/>
                </form>
                {this._renderForm()}
                {this._renderButtons()}
                {showAlert && recordSaved.status === ACTION_STATUS.ERROR &&
                <div>
                    <AlertMessage type={ALERT_TYPES.DANGER}
                                  message={this.props.formatMessage('record.save-error', {error: this.i18n(recordSaved.error.messageId)})}/>
                    <br/>
                </div>}
                {showAlert && recordSaved.status === ACTION_STATUS.SUCCESS &&
                <div><AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('record.save-success')}/><br/></div>}
            </div>;
    }

    _renderHeader() {
        const identifier = this.props.record && this.props.record.localName ? this.props.record.localName : '';
        const formTemplateName = this._getFormTemplateName();
        return <span>{
            (formTemplateName)
                ? formTemplateName + ' ' + identifier
                : <FormattedMessage id='record.panel-title' values={{identifier}}/>
        }</span>
    }

    _renderForm() {
        const {record, loadFormgen, formgen} = this.props;

        return !record.state.isInitial() ?
            <RecordForm
                ref={this.recordForm}
                record={record}
                loadFormgen={loadFormgen}
                formgen={formgen}
                currentUser={this.props.currentUser}
                isFormValid={this.isFormValid}/>
            : null;
    }

    _renderButtons() {
        const {record, recordSaved, formgen} = this.props;

        return <div className="mt-3 text-center">
            <Button variant='success' size='sm'
                    disabled={formgen.status === ACTION_STATUS.PENDING || recordSaved.status === ACTION_STATUS.PENDING
                    || !this.state.isFormValid || !record.state.isComplete()}
                    onClick={this.props.handlers.onSave}>
                {this.i18n('save')}{recordSaved.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
            </Button>
            <Button variant='link' size='sm'
                    onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
        </div>
    }

    _renderInstitution() {
        const record = this.props.record;
        if (!record.institution) {
            return null;
        }
        return <div className='row'>
            <div className='col-12 col-sm-6'>
                <HorizontalInput
                    labelWidth={4} inputWidth={8} type='text' value={record.institution.name}
                    label={this.i18n('record.institution')}
                    readOnly/>
            </div>
        </div>;
    }

    _getFormTemplateName() {
        const {formTemplatesLoaded, record, intl} = this.props;
        const formTemplate = this.props.formTemplate || record?.formTemplate;
        if (formTemplate) {
            const formTemplateOptions =
                formTemplatesLoaded.formTemplates
                    ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
                    : [];
            return formTemplateOptions.find(r => r.id === formTemplate)?.name;
        }
    }

    _showInstitution() {
        return this._isAdmin();
    }

    _getPanelTitle() {
        if (!this._isAdmin() && this.props.formTemplate) {
            const formTemplateName = this._getFormTemplateName();
            if (formTemplateName) {
                return formTemplateName;
            }
        }
        return this.i18n('record.panel-title');
    }

    _isAdmin() {
        return this.props.currentUser.role === ROLE.ADMIN
    }
}

Record.propTypes = {
    record: PropTypes.object,
    handlers: PropTypes.object.isRequired,
    recordSaved: PropTypes.object,
    recordLoaded: PropTypes.object,
    formgen: PropTypes.object,
    loadFormgen: PropTypes.func,
    showAlert: PropTypes.bool,
    formTemplatesLoaded: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    formTemplate: PropTypes.string
};

export default injectIntl(withI18n(Record, {forwardRef: true}), {forwardRef: true});
