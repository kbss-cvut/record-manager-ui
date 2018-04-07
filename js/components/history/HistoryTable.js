'use strict';

import React from "react";
import {Table} from "react-bootstrap";

import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import HistoryRow from "./HistoryRow";
import {ACTIONS_PER_PAGE} from "../../constants/DefaultConstants";
import HistorySearch from "./HistorySearch";

class HistoryTable extends React.Component {
    static propTypes = {
        actions: React.PropTypes.array.isRequired,
        handlers: React.PropTypes.object.isRequired,
        searchData: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        return <div>
                <Table responsive striped bordered condensed hover>
                    {this._renderHeader()}
                    <tbody>
                        <HistorySearch handlers={this.props.handlers} searchData={this.props.searchData} />
                        { this.props.actions.length > 0 ? this._renderRows()
                            : <tr className="font-italic"><td colSpan="4">{this.i18n('history.not-found')}</td></tr>
                        }
                    </tbody>
                </Table>
        </div>;
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='col-xs-4 col-sm-4 col-md-4 content-center'>{this.i18n('history.action-type')}</th>
            <th className='col-xs-3 col-sm-3 col-md-3 content-center'>{this.i18n('history.author')}</th>
            <th className='col-xs-3 col-sm-3 col-md-3 content-center'>{this.i18n('history.time')}</th>
            <th className='col-xs-2 col-sm-3 col-md-2 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>;
    }

    _renderRows() {
        const {actions, handlers} = this.props;
        let len = actions.length > ACTIONS_PER_PAGE ? actions.length - 1 : actions.length;
        let rows = [];
        for (let i = 0; i < len; i++) {
            rows.push(<HistoryRow key={actions[i].key} action={actions[i]} onOpen={handlers.onOpen}/>);
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(HistoryTable));
