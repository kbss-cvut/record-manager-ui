'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import Mask from "../Mask";
import RecordForm from "./RecordForm";
import RecordProvenance from "./RecordProvenance";
import RequiredAttributes from "./RequiredAttributes";
import WizardStore from "../../stores/WizardStore";
import {FormUtils} from "semforms";

class Record extends React.Component {
    static propTypes = {
        record: React.PropTypes.object,
        loading: React.PropTypes.bool,
        handlers: React.PropTypes.object.isRequired
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
        if (this.props.loading || !this.props.record) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        const record = this.props.record;
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <form className='form-horizontal'>
                <RequiredAttributes record={record} onChange={this._onChange} completed={record.state.isComplete()}/>
                {this._renderClinic()}
                <RecordProvenance record={record}/>
            </form>
            {this._renderForm()}
            {this._renderButtons()}
        </Panel>;
    }

    _renderHeader() {
        const name = this.props.record.localName ? this.props.record.localName : '';
        return <h3>
            <FormattedMessage id='record.panel-title' values={{identifier: name}}/>
        </h3>;
    }

    _renderClinic() {
        const record = this.props.record;
        if (!record.clinic) {
            return null;
        }
        return <div className='row'>
            <div className='col-xs-4'>
                <HorizontalInput type='text' value={record.clinic.name} label={this.i18n('record.clinic')}
                       labelWidth={4} inputWidth={8} readOnly/>
            </div>
        </div>;
    }

    _renderForm() {
        const record = this.props.record;
        return !record.state.isInitial() ?
            <RecordForm ref={(c) => this.form = c} record={this.props.record}/> : null;
    }

    _renderButtons() {
        const record = this.props.record;
        return <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
            <Button bsStyle='success' bsSize='small'
                    disabled={this.props.loading || this.props.saving || this._isFormInvalid() || !record.state.isComplete()}
                    onClick={this.props.handlers.onSave}>{this.i18n(this.props.saving ? 'saving' : 'save')}</Button>
            <Button bsStyle='link' bsSize='small'
                    onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
        </div>
    }

    _isFormInvalid() {
        return WizardStore.data ? FormUtils.isValid(WizardStore.data) : false;
    }
}

export default injectIntl(I18nWrapper(Record));
