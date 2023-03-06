'use strict';

import React from "react";
import {Button, Card} from "react-bootstrap";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import RecordTable from "./RecordTable";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {processTypeaheadOptions} from "./TypeaheadAnswer";

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
        const {showAlert, recordDeleted, formTemplate} = this.props;
        const showCreateButton = STUDY_CREATE_AT_MOST_ONE_RECORD
                ? (!this.props.recordsLoaded.records || (this.props.recordsLoaded.records.length < 1))
                : true;
        const createRecordDisabled =
            STUDY_CLOSED_FOR_ADDITION
            && (!this._isAdmin());
        const createRecordTooltip = this.i18n(
            createRecordDisabled
                ? 'records.closed-study.create-tooltip'
                : 'records.opened-study.create-tooltip'
        );
        const onCreateWithFormTemplate = () => this.props.handlers.onCreate(formTemplate);
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this._getPanelTitle()}
                {this.props.recordsLoaded.records && this.props.recordsLoaded.status === ACTION_STATUS.PENDING &&
                <LoaderSmall/>}
            </Card.Header>
            <Card.Body>
                <RecordTable {...this.props}/>
                <div>
                    {showCreateButton
                        ? <Button variant='primary' size='sm'
                            disabled={createRecordDisabled}
                            title={createRecordTooltip}
                            onClick={onCreateWithFormTemplate}>{this.i18n('records.create-tile')}</Button>
                        : null}
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
        if (!this._isAdmin() && this.props.formTemplate) {
            const formTemplateName = this._getFormTemplateName();
            if (formTemplateName) {
                return  formTemplateName;
            }
        }
        return this.i18n('records.panel-title');
    }

    _isAdmin() {
        return this.props.currentUser.role === ROLE.ADMIN
    }
}

export default injectIntl(withI18n(Records));
