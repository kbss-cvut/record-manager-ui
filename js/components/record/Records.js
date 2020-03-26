'use strict';

import React from "react";
import {Button, Card} from "react-bootstrap";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import RecordTable from "./RecordTable";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";

const STUDY_CLOSED_FOR_ADDITION = false;

class Records extends React.Component {
    static propTypes = {
        recordsLoaded: PropTypes.object,
        recordDeleted: PropTypes.object,
        recordsDeleting: PropTypes.array,
        showAlert: PropTypes.bool.isRequired,
        handlers: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {showAlert, recordDeleted} = this.props;
        const createRecordDisabled =
            STUDY_CLOSED_FOR_ADDITION
            && (this.props.currentUser.role !== ROLE.ADMIN);
        const createRecordTooltip = this.i18n(
            createRecordDisabled
                ? 'records.closed-study.create-tooltip'
                : 'records.opened-study.create-tooltip'
        );
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this.i18n('records.panel-title')}
                {this.props.recordsLoaded.records && this.props.recordsLoaded.status === ACTION_STATUS.PENDING &&
                <LoaderSmall/>}
            </Card.Header>
            <Card.Body>
                <RecordTable {...this.props}/>
                <div>
                    <Button variant='primary' size='sm'
                            disabled={createRecordDisabled}
                            title={createRecordTooltip}
                            onClick={this.props.handlers.onCreate}>{this.i18n('records.create-tile')}</Button>
                </div>
                {showAlert && recordDeleted.status === ACTION_STATUS.ERROR &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('record.delete-error', {error: this.i18n(this.props.recordDeleted.error.message)})}/>}
                {showAlert && recordDeleted.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('record.delete-success')}/>}
            </Card.Body>
        </Card>;
    }
}

export default injectIntl(I18nWrapper(Records));
