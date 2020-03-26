'use strict';

import React from "react";
import {Button, Card} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import RecordForm from "./RecordForm";
import RecordProvenance from "./RecordProvenance";
import RequiredAttributes from "./RequiredAttributes";
// import {WizardStoreInstance} from '../wizard/generator/WizardBuilder';
// import {FormUtils} from "s-forms";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderPanel, LoaderSmall} from "../Loader";
import PropTypes from "prop-types";

class Record extends React.Component {
    static propTypes = {
        record: PropTypes.object,
        handlers: PropTypes.object.isRequired,
        recordSaved: PropTypes.object,
        recordLoaded: PropTypes.object,
        formgen: PropTypes.object,
        loadFormgen: PropTypes.func,
        showAlert: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    _onChange = (e) => {
        const change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    getFormData = () => {
        return this.form.refs.wrappedInstance.getWrappedComponent().getFormData();
    };

    render() {
        const {recordLoaded, recordSaved, showAlert, record} = this.props;
        if (!record && (!recordLoaded.status || recordLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this._renderHeader()} variant='primary'/>;
        } else if (recordLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('record.load-error', {error: this.props.recordLoaded.error.message})}/>;
        }
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">{this._renderHeader()}</Card.Header>
            <Card.Body>
                <form className='form-horizontal'>
                    <RequiredAttributes record={record} onChange={this._onChange}
                                        completed={record.state.isComplete()}/>
                    {this._renderInstitution()}
                    <RecordProvenance record={record}/>
                </form>
                {this._renderForm()}
                {this._renderButtons()}
                {showAlert && recordSaved.status === ACTION_STATUS.ERROR &&
                <div>
                    <AlertMessage type={ALERT_TYPES.DANGER}
                                  message={this.props.formatMessage('record.save-error', {error: this.i18n(recordSaved.error.message)})}/>
                    <br/>
                </div>}
                {showAlert && recordSaved.status === ACTION_STATUS.SUCCESS &&
                <div><AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('record.save-success')}/><br/></div>}
            </Card.Body>
        </Card>;
    }

    _renderHeader() {
        const name = this.props.record && this.props.record.localName ? this.props.record.localName : '';
        return <span><FormattedMessage id='record.panel-title' values={{identifier: name}}/></span>;
    }

    _renderForm() {
        const record = this.props.record;
        return !record.state.isInitial() ?
            <RecordForm ref={(c) => this.form = c} record={this.props.record}
                        loadFormgen={this.props.loadFormgen}
                        formgen={this.props.formgen}/> : null;
    }

    _renderButtons() {
        const {record, recordSaved, formgen} = this.props;
        return <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
            <Button variant='success' size='sm'
                    disabled={formgen.status === ACTION_STATUS.PENDING || recordSaved.status === ACTION_STATUS.PENDING
                    || this._isFormInvalid() || !record.state.isComplete()}
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

    _isFormInvalid() {
        //  return WizardStoreInstance.data ? FormUtils.isValid(WizardStoreInstance.data) : false;
    }
}

export default injectIntl(I18nWrapper(Record), {withRef: true});
