'use strict';

import React from "react";
import {Table} from "react-bootstrap";

import DeleteItemDialog from "../DeleteItemDialog";
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import InstitutionRow from "./InstitutionRow";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";

class HistoryTable extends React.Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        return <div>
            {this.props.institutions.length > 0 ?
                <Table responsive striped bordered condensed hover>
                    {this._renderHeader()}
                    <tbody>
                    {this._renderRows()}
                    </tbody>
                </Table>
                :
                <p className="font-italic">{this.i18n('institutions.not-found')}</p>
            }
        </div>;
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='col-xs-4 col-sm-4 col-md-4 content-center'>{this.i18n('history.action-type')}</th>
            <th className='col-xs-4 col-sm-3 col-md-4 content-center'>{this.i18n('history.owner')}</th>
            <th className='col-xs-2 col-sm-3 col-md-2 content-center'>{this.i18n('history.time')}</th>
            <th className='col-xs-2 col-sm-3 col-md-2 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>;
    }

    _renderRows() {
        let rows = [];
        /*
        for (let i = 0, len = institutions.length; i < len; i++) {
            rows.push(<HistoryRow key={institutions[i].key} institution={institutions[i]} onOpen={onOpen}
                                      />);
        }
        return rows;
        */
    }
}

export default injectIntl(I18nWrapper(HistoryTable));
