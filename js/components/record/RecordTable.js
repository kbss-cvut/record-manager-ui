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
        formTemplate: PropTypes.string,
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
        const filteredRecords = this._getFormTemplateRecords();
        return <div>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedRecord}
                              itemLabel={this._getDeleteLabel()}/>
            {filteredRecords.length > 0 ?
                <Table size="sm" responsive striped bordered hover>
                    {this._renderHeader()}
                    <tbody>
                    {this._renderRows(filteredRecords)}
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
                && <th className='w-15 content-center'>{this.i18n('records.id')}</th>
            }
            <th className='w-25 content-center'>{this.i18n('records.local-name')}</th>
            <th className='w-25 content-center'>{this.i18n('institution.panel-title')}</th>
            {(this._isAdmin())
                && <th className='w-25 content-center'>{this.i18n('records.form-template')}</th>
            }
            <th className='w-25 content-center'>{this.i18n('records.last-modified')}</th>
            {(this._isAdmin())
                && <th className='w-15 content-center'>{this.i18n('records.completion-status')}</th>
            }
            <th className='w-20 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>
    }

    _renderRows(filteredRecords) {
        const {formTemplatesLoaded, handlers, recordsDeleting, intl} = this.props;
        const formTemplateOptions =
            formTemplatesLoaded.formTemplates ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl) : [];
        let rows = [];
        for (let i = 0, len = filteredRecords.length; i < len; i++) {
            rows.push(<RecordRow key={filteredRecords[i].key} record={filteredRecords[i]} onEdit={handlers.onEdit}
                                 onDelete={this._onDelete}
                                 formTemplateOptions={formTemplateOptions}
                                 currentUser={this.props.currentUser}
                                 disableDelete={this.props.disableDelete} deletionLoading={!this.props.disableDelete &&
            !!(recordsDeleting.includes(filteredRecords[i].key))}/>);
        }
        return rows;
    }

    _getFormTemplateRecords() {
        const records = this.props.recordsLoaded.records,
            formTemplate = this.props.formTemplate;

        if (!formTemplate) {
            return records;
        }
        return records.filter((r) => (r.formTemplate === formTemplate))
    }

    _isAdmin() {
        return this.props.currentUser.role === ROLE.ADMIN;
    }
}

export default injectIntl(withI18n(RecordTable));
