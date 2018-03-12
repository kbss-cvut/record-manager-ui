'use strict';

import React from "react";
import {Table} from "react-bootstrap";
import DeleteItemDialog from "../DeleteItemDialog";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import RecordRow from "./RecordRow";

class RecordTable extends React.Component {
    static propTypes = {
        records: React.PropTypes.array.isRequired,
        handlers: React.PropTypes.object.isRequired,
        recordDeleted: React.PropTypes.object,
        disableDelete: React.PropTypes.bool
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
        return <div>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedRecord}
                              itemLabel={this._getDeleteLabel()}/>
            <Table  responsive striped bordered condensed hover>
                {this._renderHeader()}
                <tbody>
                {this._renderRows()}
                </tbody>
            </Table>
        </div>;
    }

    _getDeleteLabel() {
        return this.state.selectedRecord ? this.state.selectedRecord.localName : '';
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='col-xs-3 col-sm-2 col-md-3 content-center'>{this.i18n('records.id')}</th>
            <th className='col-xs-3 col-sm-3 col-md-3 content-center'>{this.i18n('records.local-name')}</th>
            <th className='col-xs-3 col-sm-3 col-md-3 content-center'>{this.i18n('records.last-modified')}</th>
            <th className='col-xs-1 col-sm-1 col-md-1 content-center'>{this.i18n('records.completion-status')}</th>
            <th className='col-xs-2 col-sm-3 col-md-2 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>
    }

    _renderRows() {
        const {records, handlers, recordDeleted} = this.props;
        let rows = [];
        for (let i = 0, len = records.length; i < len; i++) {
            rows.push(<RecordRow key={records[i].key} record={records[i]} onEdit={handlers.onEdit} onDelete={this._onDelete}
                                 disableDelete={this.props.disableDelete} deletionLoading={!this.props.disableDelete &&
            !!(recordDeleted.status === ACTION_STATUS.PENDING
                && recordDeleted.key === records[i].key)}/>);
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(RecordTable));
