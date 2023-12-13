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
import {deleteRecord, updateRecord} from "../../actions/RecordActions";
import {loadFormTemplates} from "../../actions/FormTemplatesActions";
import {extractQueryParam} from "../../utils/Utils"
import {RECORD_PHASE} from "../../constants/DefaultConstants";

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

    _onPublishRecords = async () => {
        const currentUser = this.props.currentUser;

        this.setState({
            records: this.props.recordsLoaded.records
        }, async () => {
            const updatedRecords = this.state.records.map(async (record) => {
                if (record.phase === RECORD_PHASE.COMPLETED) {
                    const updatedRecord = {...record, phase: RECORD_PHASE.PUBLISHED};
                    await this.props.updateRecord(updatedRecord, currentUser);
                    return updatedRecord;
                }
            });

            return await Promise.all(updatedRecords);
        })

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
            onDelete: this._onDeleteRecord,
            onPublish: this._onPublishRecords
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
        updateRecord: bindActionCreators(updateRecord, dispatch),
        loadRecords: bindActionCreators(loadRecords, dispatch),
        loadFormTemplates: bindActionCreators(loadFormTemplates, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}