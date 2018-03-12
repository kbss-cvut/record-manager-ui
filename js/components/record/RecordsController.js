'use strict';

import React from 'react';

import Records from "./Records";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import {deleteRecord, deleteUser, loadRecords, loadUsers} from "../../actions";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import {ROLE} from "../../constants/DefaultConstants";

class RecordsController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    componentDidMount() {
        this.props.loadRecords(this.props.currentUser);
    }

    _onEditRecord = (record) => {
        Routing.transitionTo(Routes.editRecord, {
            params: {key: record.key},
            handlers: {
                onCancel: Routes.records
            }
        });
    };

    _onAddRecord = () => {
        Routing.transitionTo(Routes.createRecord, {
            handlers: {
                onSuccess: Routes.records,
                onCancel: Routes.records
            }
        });
    };

    _onDeleteRecord = (record) => {
        this.props.deleteRecord(record, this.props.currentUser);
        this.setState({showAlert: true});
    };

    render() {
        const {recordsLoaded, recordDeleted, currentUser} = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onEdit: this._onEditRecord,
            onCreate: this._onAddRecord,
            onDelete: this._onDeleteRecord
        };
        return <Records records={recordsLoaded.records || []} showAlert={this.state.showAlert} handlers={handlers} recordDeleted={recordDeleted}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(RecordsController))));

function mapStateToProps(state) {
    return {
        recordDeleted: state.record.recordDeleted,
        recordsLoaded: state.records.recordsLoaded,
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteRecord: bindActionCreators(deleteRecord, dispatch),
        loadRecords: bindActionCreators(loadRecords, dispatch)
    }
}