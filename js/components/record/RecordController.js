'use strict';

import React from 'react';
import assign from 'object-assign';

import EntityFactory from '../../utils/EntityFactory';
import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import MessageWrapper from "../misc/hoc/MessageWrapper";
import Record from './Record';
import RecordState from "../../model/RecordState";
import RecordValidator from "../../validation/RecordValidator";
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';
import {ACTION_FLAG, ACTION_STATUS} from "../../constants/DefaultConstants";
import {createRecord, loadRecord, unloadRecord, unloadSavedRecord, updateRecord} from "../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class RecordController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: this._isNew() ? EntityFactory.initNewPatientRecord() : null,
            loading: false,
            saved: false,
            showAlert: false
        };
    }

    _isNew() {
        return !this.props.params.key;
    }

    componentWillMount() {
        const recordKey = this.props.params.key;
        if (!this.state.record) {
            this.setState({loading: true});
            this.props.loadRecord(recordKey);
        }
        if(this.props.recordSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
            this.setState({showAlert: true});
            this.props.unloadSavedRecord();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.saved && nextProps.recordLoaded.status !== ACTION_STATUS.PENDING
            && nextProps.recordSaved.status === ACTION_STATUS.SUCCESS) {
            if (nextProps.recordSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                Routing.transitionTo(Routes.editRecord, {
                    params: {key: nextProps.recordSaved.record.key},
                    handlers: {
                        onCancel: Routes.records
                    }
                });
            } else {
                this.setState({saved: false});
                this.props.loadRecord(this.state.record.key);
            }
        }
        if (this.props.recordLoaded.status === ACTION_STATUS.PENDING && nextProps.recordLoaded.status === ACTION_STATUS.SUCCESS) {
            const record = nextProps.recordLoaded.record;
            record.state = RecordState.createRecordState();
            this.setState({record: record, loading: false});
        }
        if (this.props.recordLoaded.status === ACTION_STATUS.PENDING && nextProps.recordLoaded.status === ACTION_STATUS.ERROR) {
            this.setState({loading: false});
        }
    }

    componentWillUnmount() {
        this.props.unloadRecord();
    }

    _onSave = () => {
        const currentUser = this.props.currentUser;
        const record = this.state.record;
        this.setState({saved: true, showAlert: true});
        record.question = this.recordComponent.refs.wrappedInstance.getWrappedComponent().getFormData();
        if (record.isNew) {
            delete record.isNew;
            this.props.createRecord(record, currentUser);
        } else {
            this.props.updateRecord(record, currentUser);
        }
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
        const {recordLoaded, recordSaved, currentUser} = this.props;
        if (!currentUser || !this.state.record) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange
        };
        return <Record ref={(c) => this.recordComponent = c} handlers={handlers} record={this.state.record}
                       loading={this.state.loading} saving={this.state.saved} recordLoaded={recordLoaded}
                       recordSaved={recordSaved} showAlert={this.state.showAlert}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(RecordController)), {withRef: true}));

function mapStateToProps(state) {
    return {
        status: state.auth.status,
        currentUser: state.auth.user,
        recordLoaded: state.record.recordLoaded,
        recordSaved: state.record.recordSaved,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadRecord: bindActionCreators(loadRecord, dispatch),
        unloadRecord: bindActionCreators(unloadRecord, dispatch),
        createRecord: bindActionCreators(createRecord, dispatch),
        updateRecord: bindActionCreators(updateRecord, dispatch),
        unloadSavedRecord: bindActionCreators(unloadSavedRecord, dispatch)
    }
}