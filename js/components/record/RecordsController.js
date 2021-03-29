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
import {loadFormTemplates} from "../../actions/FormTemplatesActions";
import {extractQueryParam} from "../../utils/Utils"

class RecordsController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    componentDidMount() {
        this.props.loadRecords(this.props.currentUser);
        this.props.loadFormTemplates();
    }

    _onEditRecord = (record) => {
        this.props.transitionToWithOpts(Routes.editRecord, {
            params: {key: record.key},
            handlers: {
                onCancel: Routes.records
            }
        });
    };

    _onAddRecord = (formTemplate) => {
        const opts = {};
        if (formTemplate) {
            opts.query = new Map([["formTemplate", formTemplate]]);
        }
        opts.handlers = {
            onSuccess: Routes.records,
                onCancel: Routes.records
        }
        this.props.transitionToWithOpts(Routes.createRecord, opts);
    };

    _onDeleteRecord = (record) => {
        this.props.deleteRecord(record, this.props.currentUser);
        this.setState({showAlert: true});
    };

    render() {
        const {formTemplatesLoaded, recordsLoaded, recordDeleted, recordsDeleting, currentUser} = this.props;
        const formTemplate = extractQueryParam(this.props.location.search, "formTemplate");
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
                        formTemplate={formTemplate}
                        formTemplatesLoaded={formTemplatesLoaded}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(RecordsController)));

function mapStateToProps(state) {
    return {
        recordDeleted: state.record.recordDeleted,
        recordsLoaded: state.records.recordsLoaded,
        formTemplatesLoaded: state.formTemplates.formTemplatesLoaded,
        recordsDeleting: state.record.recordsDeleting,
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteRecord: bindActionCreators(deleteRecord, dispatch),
        loadRecords: bindActionCreators(loadRecords, dispatch),
        loadFormTemplates: bindActionCreators(loadFormTemplates, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}