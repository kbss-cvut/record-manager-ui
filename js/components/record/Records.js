'use strict';

import React from "react";
import {Button, Card} from "react-bootstrap";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import RecordTable from "./RecordTable";
import {ACTION_STATUS, ALERT_TYPES, EXTENSION_CONSTANTS} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {processTypeaheadOptions} from "./TypeaheadAnswer";
import {EXTENSIONS} from "../../../config";
import ExportRecordsDropdown from "./ExportRecordsDropdown";
import {isAdmin} from "../../utils/SecurityUtils";

const STUDY_CLOSED_FOR_ADDITION = false;
const STUDY_CREATE_AT_MOST_ONE_RECORD = false;

class Records extends React.Component {
    static propTypes = {
        recordsLoaded: PropTypes.object,
        recordDeleted: PropTypes.object,
        recordsDeleting: PropTypes.array,
        showAlert: PropTypes.bool.isRequired,
        handlers: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        formTemplatesLoaded: PropTypes.object.isRequired,
        formTemplate: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {showAlert, recordDeleted, formTemplate, recordsLoaded} = this.props;
        const showCreateButton = STUDY_CREATE_AT_MOST_ONE_RECORD
            ? (!recordsLoaded.records || (recordsLoaded.records.length < 1))
            : true;
        const showPublishButton =
            isAdmin(this.props.currentUser)
            && EXTENSIONS === EXTENSION_CONSTANTS.OPERATOR;
        const createRecordDisabled =
            STUDY_CLOSED_FOR_ADDITION
            && (!isAdmin(this.props.currentUser));
        const createRecordTooltip = this.i18n(
            createRecordDisabled
                ? 'records.closed-study.create-tooltip'
                : 'records.opened-study.create-tooltip'
        );
        const onCreateWithFormTemplate = () => this.props.handlers.onCreate(formTemplate);
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this._getPanelTitle()}
                {recordsLoaded.records && recordsLoaded.status === ACTION_STATUS.PENDING &&
                    <LoaderSmall/>}
            </Card.Header>
            <Card.Body>
                <RecordTable {...this.props}/>
                <div className="d-flex justify-content-between">
                    {showCreateButton
                        ? <Button className="mx-1" variant='primary' size='sm'
                                  disabled={createRecordDisabled}
                                  title={createRecordTooltip}
                                  onClick={onCreateWithFormTemplate}>{this.i18n('records.create-tile')}</Button>
                        : null}
                    {showPublishButton ?
                        <Button className="mx-1" variant='success' size='sm'
                                onClick={this.props.handlers.onPublish}>
                            {this.i18n('publish')}
                        </Button>
                        : null}
                    <ExportRecordsDropdown onExport={this.props.handlers.onExport} records={recordsLoaded.records}/>
                </div>
                {showAlert && recordDeleted.status === ACTION_STATUS.ERROR &&
                    <AlertMessage type={ALERT_TYPES.DANGER}
                                  message={this.props.formatMessage('record.delete-error', {error: this.i18n(this.props.recordDeleted.error.message)})}/>}
                {showAlert && recordDeleted.status === ACTION_STATUS.SUCCESS &&
                    <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('record.delete-success')}/>}
            </Card.Body>
        </Card>;
    }

    _getFormTemplateName() {
        const {formTemplatesLoaded, formTemplate, intl} = this.props;
        if (formTemplate) {
            const formTemplateOptions =
                formTemplatesLoaded.formTemplates
                    ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
                    : [];
            return formTemplateOptions.find(r => r.id === formTemplate)?.name;
        }
    }

    _getPanelTitle() {
        if (!isAdmin(this.props.currentUser) && this.props.formTemplate) {
            const formTemplateName = this._getFormTemplateName();
            if (formTemplateName) {
                return formTemplateName;
            }
        }
        return this.i18n('records.panel-title');
    }
}

export default injectIntl(withI18n(Records));
