'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import RecordTable from "./RecordTable";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderSmall} from "../Loader";

const STUDY_CLOSED_FOR_ADDITION = false;

class Records extends React.Component {
    static propTypes = {
        recordsLoaded: React.PropTypes.object,
        recordDeleted: React.PropTypes.object,
        recordsDeleting: React.PropTypes.array,
        showAlert: React.PropTypes.bool.isRequired,
        handlers: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired
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
        const createRecordTooltip= this.i18n(
            createRecordDisabled
                ?'records.closed-study.create-tooltip'
                :'records.opened-study.create-tooltip'
        );
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <RecordTable {...this.props}/>
            <div>
                <Button bsStyle='primary'
                        disabled={createRecordDisabled}
                        title={createRecordTooltip}
                        onClick={this.props.handlers.onCreate}>{this.i18n('records.create-tile')}</Button>
            </div>
            {showAlert && recordDeleted.status === ACTION_STATUS.ERROR &&
            <AlertMessage type={ALERT_TYPES.DANGER}
                          message={this.props.formatMessage('record.delete-error', {error: this.i18n(this.props.recordDeleted.error.message)})}/>}
            {showAlert && recordDeleted.status === ACTION_STATUS.SUCCESS &&
            <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('record.delete-success')}/>}
        </Panel>;
    }

    _renderHeader() {
        return <span>
            {this.i18n('records.panel-title')}
            {this.props.recordsLoaded.records && this.props.recordsLoaded.status === ACTION_STATUS.PENDING && <LoaderSmall />}
        </span>;
    }
}

export default injectIntl(I18nWrapper(Records));
