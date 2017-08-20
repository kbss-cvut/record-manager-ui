'use strict';

import React from 'react';
import assign from 'object-assign';

import Actions from '../../actions/Actions';
import EntityFactory from '../../utils/EntityFactory';
import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import MessageWrapper from "../misc/hoc/MessageWrapper";
import Record from './Record';
import RecordStore from '../../stores/RecordStore';
import RecordState from "../../model/RecordState";
import RecordValidator from "../../validation/RecordValidator";
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';

class RecordController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: this._isNew() ? EntityFactory.initNewPatientRecord() : null,
            loading: false,
            saving: false
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.key && this.state.record && this.state.record.key !== nextProps.params.key) {
            Actions.loadRecord(nextProps.params.key);
        }
    }

    _onRecordLoaded = (data) => {
        if (data.action === Actions.loadRecord) {
            const record = data.data;
            record.state = RecordState.createRecordState();
            this.setState({record: data.data, loading: false});
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onSave = () => {
        this.setState({saving: true});
        const record = this.state.record;
        record.question = this.recordComponent.refs.wrappedInstance.getWrappedComponent().getFormData();
        if (record.isNew) {
            delete record.isNew;
            Actions.createRecord(record, this._onSaveSuccess, this._onSaveError);
        } else {
            Actions.updateRecord(record, this._onSaveSuccess, this._onSaveError);
        }
    };

    _onSaveSuccess = (newKey) => {
        this.setState({saving: false});
        this.props.showSuccessMessage(this.props.i18n('record.save-success'));
        if (newKey) {
            Routing.transitionTo(Routes.editRecord, {
                params: {key: newKey},
                handlers: {
                    onCancel: Routes.records
                }
            });
        } else {
            Actions.loadRecord(this.props.params.key);
        }
    };

    _onSaveError = (err) => {
        this.setState({saving: false});
        this.props.showErrorMessage(this.props.formatMessage('record.save-error', {error: err.message}));
    };

    _onCancel = () => {
        const handlers = RouterStore.getViewHandlers(Routes.editRecord.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.records);
        }
    };

    _onChange = (change) => {
        const update = assign({}, this.state.record, change);
        if (RecordValidator.isComplete(update)) {
            update.state.recordComplete();
        } else {
            update.state.recordIncomplete();
        }
        this.setState({record: update});
    };

    render() {
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange
        };
        return <Record ref={(c) => this.recordComponent = c} handlers={handlers} record={this.state.record}
                       loading={this.state.loading} saving={this.state.saving}/>;
    }
}

export default injectIntl(I18nWrapper(MessageWrapper(RecordController)), {withRef: true});
