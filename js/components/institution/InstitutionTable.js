'use strict';

import React from "react";
import {Table} from "react-bootstrap";

import DeleteItemDialog from "../DeleteItemDialog";
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import InstitutionRow from "./InstitutionRow";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";

class InstitutionTable extends React.Component {
    static propTypes = {
        institutions: React.PropTypes.array.isRequired,
        handlers: React.PropTypes.object.isRequired,
        institutionDeleted: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            showDialog: false,
            selectedItem: null
        }
    }

    _onDelete = (item) => {
        this.setState({showDialog: true, selectedItem: item});
    };

    _onCancelDelete = () => {
        this.setState({showDialog: false, selectedItem: null});
    };

    _onSubmitDelete = () => {
        this.props.handlers.onDelete(this.state.selectedItem);
        this.setState({showDialog: false, selectedItem: null});
    };

    render() {
        return <div>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedItem}
                              itemLabel={this._getDeleteLabel()}/>
            <Table responsive striped bordered condensed hover>
                {this._renderHeader()}
                <tbody>
                {this._renderRows()}
                </tbody>
            </Table>
        </div>;
    }

    _getDeleteLabel() {
        const institution = this.state.selectedItem;
        return institution ? institution.name : '';
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='col-xs-5 col-sm-5 col-md-5 content-center'>{this.i18n('name')}</th>
            <th className='col-xs-5 col-sm-4 col-md-5 content-center'>{this.i18n('institution.email')}</th>
            <th className='col-xs-2 col-sm-3 col-md-2 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>;
    }

    _renderRows() {
        const {institutions, institutionDeleted} = this.props;
        const onEdit = this.props.handlers.onEdit;
        let rows = [];
        for (let i = 0, len = institutions.length; i < len; i++) {
            rows.push(<InstitutionRow key={institutions[i].key} institution={institutions[i]} onEdit={onEdit}
                                      onDelete={this._onDelete}
                                      deletionLoading={!!(institutionDeleted.status === ACTION_STATUS.PENDING
                                          && institutionDeleted.key === institutions[i].key)}/>);
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(InstitutionTable));
