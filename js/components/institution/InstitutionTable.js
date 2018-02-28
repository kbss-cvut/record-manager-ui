'use strict';

import React from "react";
import {Button, Table} from "react-bootstrap";

import DeleteItemDialog from "../DeleteItemDialog";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import Routes from "../../utils/Routes";
import {ROLE} from "../../constants/DefaultConstants";

class InstitutionTable extends React.Component {
    static propTypes = {
        institutions: React.PropTypes.array.isRequired,
        handlers: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired
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
        var institution = this.state.selectedItem;
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
        var items = this.props.institutions,
            rows = [],
            onEdit = this.props.handlers.onEdit;
        for (var i = 0, len = items.length; i < len; i++) {
            rows.push(<InstitutionRow key={items[i].name} institution={items[i]} onEdit={onEdit} onDelete={this._onDelete}
                                      currentUser={this.props.currentUser}/>);
        }
        return rows;
    }
}

var InstitutionRow = (props) => {
    var institution = props.institution,
        deleteButton = props.currentUser.role === ROLE.ADMIN ?
            <Button bsStyle='warning' bsSize='small' title={props.i18n('institutions.delete-tooltip')}
                    onClick={() => props.onDelete(props.institution)}>{props.i18n('delete')}</Button> : null;

    return <tr>
        <td className='report-row'>
            <a href={'#/' + Routes.institutions.path + '/' + institution.key}
               title={props.i18n('institutions.open-tooltip')}>{institution.name}</a>
        </td>
        <td className='report-row'>{institution.emailAddress}</td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small' title={props.i18n('institutions.open-tooltip')}
                    onClick={() => props.onEdit(props.institution)}>{props.i18n('open')}</Button>
            {deleteButton}
        </td>
    </tr>;
};

InstitutionRow.propTypes = {
    institution: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object.isRequired
};

InstitutionRow = injectIntl(I18nWrapper(InstitutionRow));

export default injectIntl(I18nWrapper(InstitutionTable));
