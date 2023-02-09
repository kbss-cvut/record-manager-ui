'use strict';

import React from 'react';
import {injectIntl} from "react-intl";
import withI18n from '../../i18n/withI18n';
import Record from './Record';
import Routes from "../../constants/RoutesConstants";
import {transitionToWithOpts} from '../../utils/Routing';
import {ACTION_FLAG, ACTION_STATUS} from "../../constants/DefaultConstants";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    createRecord,
    loadFormgen,
    loadRecord,
    unloadRecord,
    unloadSavedRecord,
    updateRecord
} from "../../actions/RecordActions";
import * as EntityFactory from "../../utils/EntityFactory";
import RecordValidator from "../../validation/RecordValidator";
import * as RecordState from "../../model/RecordState";
import omit from 'lodash/omit';
import {extractQueryParam} from "../../utils/Utils";
import {withRouter} from "react-router-dom";
import {EXTENSIONS} from "../../../config";

class RecordController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: this._isNew() ? EntityFactory.initNewPatientRecord() : null,
            saved: false,
            showAlert: false
        };
        this.recordComponent = React.createRef();

    }

    componentDidMount() {
        const recordKey = this.props.match.params.key;

        if (!this.state.record) {
            this.props.loadRecord(recordKey);
        }
        if (this.props.recordSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY && this.props.recordSaved.status === ACTION_STATUS.SUCCESS) {
            this.setState({showAlert: true});
            this.props.unloadSavedRecord();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {recordLoaded, recordSaved} = this.props;

        if (prevProps.recordSaved.status === ACTION_STATUS.PENDING
            && recordSaved.status === ACTION_STATUS.SUCCESS)
        { // just saved

            if (recordSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY)
            { // first time saved
                this.props.transitionToWithOpts(Routes.editRecord, {
                    params: {key: recordSaved.record.key},
                    handlers: {
                        onCancel: Routes.records
                    }
                });
                this.props.loadRecord(recordSaved.record.key);
            } else
            { // at least second time saved
                this.props.loadRecord(this.state.record.key);
            }
        } else if (prevProps.recordLoaded.status === ACTION_STATUS.PENDING
            && recordLoaded.status === ACTION_STATUS.SUCCESS)
        { // just loaded

            const record = recordLoaded.record;
            record.state = RecordState.createRecordState();
            this.setState({record: record});
        }
    }

    componentWillUnmount() {
        this.props.unloadRecord();
    }

    _isNew() {
        return !this.props.match.params.key;
    }

    _onSave = () => {
        const currentUser = this.props.currentUser;
        const record = this.state.record;
        this.setState({saved: true, showAlert: true});

        record.question = this.recordComponent.current.getFormData();
        record.localName = this._getLocalName();
        if (record.isNew) {
            this.props.createRecord(omit(record, 'isNew'), currentUser);
        } else {
            this.props.updateRecord(record, currentUser);
        }
    };

    _onCancel = () => {
        // TODO
        // const handlers = this.props.viewHandlers[Routes.editRecord.name];
        // if (handlers) {
        //     transitionTo(handlers.onCancel);
        // } else {
        const opts = {};
        const formTemplate = this.state.record?.formTemplate
        if (formTemplate) {
            opts.query = new Map([["formTemplate", formTemplate]]);
        }
        this.props.transitionToWithOpts(Routes.records, opts);
        // }
    };

    _onChange = (change) => {
        const update = {...this.state.record, ...change};
        if (RecordValidator.isComplete(update)) {
            update.state.recordComplete();
        } else {
            update.state.recordIncomplete();
        }
        this.setState({record: update});
    };

    _getLocalName() {
        if (EXTENSIONS.split(",").includes("kodi")) { // return name of the record based on answer of specific question
            return this._getKodiLocaLName();
        }
        return "record-" + Date.now();
    }

    _getKodiLocaLName() {
        return this.state.record?.question?.subQuestions?.[0]
             ?.subQuestions?.find(q => q.origin.includes("věci/pojem/název"))
             ?.subQuestions?.find(q => q.origin.includes("language-czech"))
             ?.answers?.[0]?.textValue
    }

    _getKodiMainEntityName() {
        const entityName = this.state.record?.question
            ?.subQuestions?.[0]?.origin
            .replace(/^.*pojem./, "").replace(/-[^-]*-q-qo/, "").replace("-", " ");

        return entityName.charAt(0).toUpperCase() + entityName.slice(1);
    }


    render() {
        const {recordLoaded, recordSaved, currentUser, formgen, loadFormgen, formTemplatesLoaded} = this.props;
        const formTemplate = extractQueryParam(this.props.location.search, "formTemplate");
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange
        };

        return <Record
            ref={this.recordComponent}
            handlers={handlers}
            record={this.state.record}
            recordLoaded={recordLoaded}
            recordSaved={recordSaved}
            showAlert={this.state.showAlert}
            formgen={formgen}
            loadFormgen={loadFormgen}
            formTemplatesLoaded={formTemplatesLoaded}
            formTemplate={formTemplate}
            currentUser={currentUser}
        />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(withRouter(RecordController))));

function mapStateToProps(state) {
    return {
        status: state.auth.status,
        currentUser: state.auth.user,
        recordLoaded: state.record.recordLoaded,
        recordSaved: state.record.recordSaved,
        viewHandlers: state.router.viewHandlers,
        formTemplatesLoaded: state.formTemplates.formTemplatesLoaded,
        formgen: state.record.formgen
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadRecord: bindActionCreators(loadRecord, dispatch),
        unloadRecord: bindActionCreators(unloadRecord, dispatch),
        createRecord: bindActionCreators(createRecord, dispatch),
        updateRecord: bindActionCreators(updateRecord, dispatch),
        unloadSavedRecord: bindActionCreators(unloadSavedRecord, dispatch),
        loadFormgen: bindActionCreators(loadFormgen, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}
