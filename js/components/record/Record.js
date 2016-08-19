'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import RecordForm from "./RecordForm";
import RecordValidator from "../../validation/RecordValidator";
import RequiredAttributes from "./RequiredAttributes";

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
        var change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    render() {
        if (this.props.loading || !this.props.record) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        var record = this.props.record,
            complete = RecordValidator.isComplete(record);
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <RequiredAttributes record={record} onChange={this._onChange} completed={complete}/>
            {this._renderForm(complete)}
            {this._renderButtons()}
        </Panel>;
    }

    _renderHeader() {
        var name = this.props.record.localName ? this.props.record.localName : '';
        return <h3>
            <FormattedMessage id='record.panel-title' values={{identifier: name}}/>
        </h3>;
    }

    _renderForm(completed) {
        return completed ? <RecordForm record={this.props.record} onChange={this._onChange}/> : null;
    }

    _renderButtons() {
        return <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
            <Button bsStyle='success' bsSize='small' disabled={this.props.loading}
                    onClick={this.props.handlers.onSave}>{this.i18n('save')}</Button>
            <Button bsStyle='link' bsSize='small' onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
        </div>
    }
}

export default injectIntl(I18nWrapper(Record));
