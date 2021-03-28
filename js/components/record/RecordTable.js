'use strict';

import React from "react";
import {Table} from "react-bootstrap";
import DeleteItemDialog from "../DeleteItemDialog";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import RecordRow from "./RecordRow";
import AlertMessage from "../AlertMessage";
import Loader from "../Loader";
import PropTypes from "prop-types";
import {processTypeaheadOptions} from "./TypeaheadAnswer";

class RecordTable extends React.Component {
    static propTypes = {
        recordsLoaded: PropTypes.object.isRequired,
        formTemplatesLoaded: PropTypes.object.isRequired,
        handlers: PropTypes.object.isRequired,
        recordDeleted: PropTypes.object,
        disableDelete: PropTypes.bool,
        recordsDeleting: PropTypes.array,
        currentUser: PropTypes.object.isRequired
    };

    static defaultProps = {
        disableDelete: false
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            selectedRecord: null,
            showDialog: false
        };
    }

    _onDelete = (record) => {
        this.setState({showDialog: true, selectedRecord: record});
    };

    _onCancelDelete = () => {
        this.setState({showDialog: false, selectedRecord: null});
    };

    _onSubmitDelete = () => {
        this.props.handlers.onDelete(this.state.selectedRecord);
        this.setState({showDialog: false, selectedRecord: null});
    };

    render() {
        const {recordsLoaded} = this.props;
        if (!recordsLoaded.records && (!recordsLoaded.status || recordsLoaded.status === ACTION_STATUS.PENDING)) {
            return <Loader/>
        } else if (recordsLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('records.loading-error', {error: recordsLoaded.error.message})}/>
        }
        return <div>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedRecord}
                              itemLabel={this._getDeleteLabel()}/>
            {this.props.recordsLoaded.records.length > 0 ?
                <Table size="sm" responsive striped bordered hover>
                    {this._renderHeader()}
                    <tbody>
                    {this._renderRows()}
                    </tbody>
                </Table>
                :
                <p className="font-italic">{this.i18n('records.not-found')}</p>
            }
        </div>;
    }

    _getDeleteLabel() {
        return this.state.selectedRecord ? this.state.selectedRecord.localName : '';
    }

    _renderHeader() {
        return <thead>
        <tr>
            {(this._isAdmin())
                ? <th className='w-15 content-center'>{this.i18n('records.id')}</th>
                : ""
            }
            <th className='w-25 content-center'>{this.i18n('records.local-name')}</th>
            {(this._isAdmin())
                ? <th className='w-25 content-center'>{this.i18n('records.form-template')}</th>
                : ""
            }
            <th className='w-25 content-center'>{this.i18n('records.last-modified')}</th>
            <th className='w-15 content-center'>{this.i18n('records.completion-status')}</th>
            <th className='w-20 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>
    }

    _renderRows() {
        const {recordsLoaded, formTemplatesLoaded, handlers, recordsDeleting, intl} = this.props;
        const records = recordsLoaded.records;
        const formTemplateOptions =
            formTemplatesLoaded.formTemplates ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl) : [];
        let rows = [];
        for (let i = 0, len = records.length; i < len; i++) {
            rows.push(<RecordRow key={records[i].key} record={records[i]} onEdit={handlers.onEdit}
                                 onDelete={this._onDelete}
                                 formTemplateOptions={formTemplateOptions}
                                 currentUser={this.props.currentUser}
                                 disableDelete={this.props.disableDelete} deletionLoading={!this.props.disableDelete &&
            !!(recordsDeleting.includes(records[i].key))}/>);
        }
        return rows;
    }

    _isAdmin() {
        return this.props.currentUser.role === ROLE.ADMIN;
    }
}

export default injectIntl(withI18n(RecordTable));
