'use strict';

import React from 'react';

import Records from "./Records";
import Routes from "../../constants/RoutesConstants";
import {transitionToWithOpts} from "../../utils/Routing";
import {loadRecords} from "../../actions/RecordsActions";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {deleteRecord} from "../../actions/RecordActions";
import {loadFormTypes} from "../../actions/FormTypesActions";

class RecordsController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    componentDidMount() {
        this.props.loadRecords(this.props.currentUser);
        this.props.loadFormTypes();
    }

    _onEditRecord = (record) => {
        this.props.transitionToWithOpts(Routes.editRecord, {
            params: {key: record.key},
            handlers: {
                onCancel: Routes.records
            }
        });
    };

    _onAddRecord = () => {
        this.props.transitionToWithOpts(Routes.createRecord, {
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
        const {formTypesLoaded, recordsLoaded, recordDeleted, recordsDeleting, currentUser} = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onEdit: this._onEditRecord,
            onCreate: this._onAddRecord,
            onDelete: this._onDeleteRecord
        };
        return <Records recordsLoaded={recordsLoaded} showAlert={this.state.showAlert} handlers={handlers}
                        recordDeleted={recordDeleted} recordsDeleting={recordsDeleting} currentUser={currentUser}
                        formTypesLoaded={formTypesLoaded}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(RecordsController)));

function mapStateToProps(state) {
    return {
        recordDeleted: state.record.recordDeleted,
        recordsLoaded: state.records.recordsLoaded,
        formTypesLoaded: state.formTypes.formTypesLoaded,
        recordsDeleting: state.record.recordsDeleting,
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteRecord: bindActionCreators(deleteRecord, dispatch),
        loadRecords: bindActionCreators(loadRecords, dispatch),
        loadFormTypes: bindActionCreators(loadFormTypes, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}