'use strict';

import React from "react";
import {Table} from "react-bootstrap";

import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import HistoryRow from "./HistoryRow";
import {NUMBER_OF_SEARCH_RESULTS} from "../../constants/DefaultConstants";

class HistoryTable extends React.Component {
    static propTypes = {
        actions: React.PropTypes.array.isRequired,
        onOpen: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        return <div>
            {this.props.actions.length > 0 ?
                <Table responsive striped bordered condensed hover>
                    {this._renderHeader()}
                    <tbody>
                    {this._renderRows()}
                    </tbody>
                </Table>
                :
                <p className="font-italic">{this.i18n('history.not-found')}</p>
            }
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
        const {actions} = this.props;
        let len = actions.length > NUMBER_OF_SEARCH_RESULTS ? actions.length - 1 : actions.length;
        let rows = [];
        for (let i = 0; i < len; i++) {
            rows.push(<HistoryRow key={actions[i].key} action={actions[i]} onOpen={this.props.onOpen}/>);
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(HistoryTable));
