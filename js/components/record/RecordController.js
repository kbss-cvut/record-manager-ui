'use strict';

import React from 'react';
import assign from 'object-assign';

import Actions from '../../actions/Actions';
import EntityFactory from '../../utils/EntityFactory';
import Record from './Record';
import RecordStore from '../../stores/RecordStore';
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';

export default class RecordController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: this._isNew() ? EntityFactory.initNewPatientRecord() : null,
            loading: false
        };
    }

    _isNew() {
        return !this.props.params.key;
    }

    componentDidMount() {
        if (!this.state.record) {
            Actions.loadRecord(this.props.params.key);
            this.setState({loading: true});
        }
        this.unsubscribe = RecordStore.listen(this._onRecordLoaded);
    }

    _onRecordLoaded = (data) => {
        if (data.action === Actions.loadRecord) {
            this.setState({record: data.data, loading: false});
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onSave = () => {
        var record = this.state.record;
        if (record.isNew) {
            delete record.isNew;
            Actions.createRecord(record, this._onSaveSuccess, this._onSaveError);
        } else {
            Actions.updateRecord(record, this._onSaveSuccess, this._onSaveError);
        }
    };

    _onSaveSuccess = () => {

    };

    _onSaveError = () => {

    };

    _onCancel = () => {
        var handlers = RouterStore.getViewHandlers(Routes.editRecord.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.records);
        }
    };

    _onChange = (change) => {
        var update = assign({}, this.state.record, change);
        this.setState({record: update});
    };

    render() {
        var handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange
        };
        return <Record handlers={handlers} record={this.state.record} loading={this.state.loading}/>;
    }
}
