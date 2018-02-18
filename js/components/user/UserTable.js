'use strict';

import React from "react";
import {Button, Table} from "react-bootstrap";
import DeleteItemDialog from "../DeleteItemDialog";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import Routes from "../../utils/Routes";

class UserTable extends React.Component {
    static propTypes = {
        users: React.PropTypes.array.isRequired,
        handlers: React.PropTypes.object.isRequired,
        userDeleted: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            showDialog: false,
            selectedUser: null
        }
    }

    _onDelete = (user) => {
        this.setState({showDialog: true, selectedUser: user});
    };

    _onCancelDelete = () => {
        this.setState({showDialog: false, selectedUser: null});
    };

    _onSubmitDelete = () => {
        this.props.handlers.onDelete(this.state.selectedUser);
        this.setState({showDialog: false, selectedUser: null});
    };

    render() {
        return <div>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedUser}
                              itemLabel={this._getDeleteLabel()}/>
            <Table responsive striped bordered condensed hover>
                {this._renderHeader()}
                <tbody>
                {this._renderUsers()}
                </tbody>
            </Table>
        </div>;
    }

    _getDeleteLabel() {
        const user = this.state.selectedUser;
        return user ? user.firstName + ' ' + user.lastName : '';
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='col-xs-3 col-sm-3 col-md-3 content-center'>{this.i18n('name')}</th>
            <th className='col-xs-2 col-sm-2 col-md-2 content-center'>{this.i18n('login.username')}</th>
            <th className='col-xs-3 col-sm-2 col-md-3 content-center'>{this.i18n('institution.name')}</th>
            <th className='col-xs-2 col-sm-2 col-md-2 content-center'>{this.i18n('users.email')}</th>
            <th className='col-xs-2 col-sm-3 col-md-2 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>;
    }

    _renderUsers() {
        const users = this.props.users,
            onEdit = this.props.handlers.onEdit,
            userDeleted = this.props.userDeleted;
        let rows = [];
        for (let i = 0, len = users.length; i < len; i++) {
            rows.push(<UserRow key={users[i].username} user={users[i]} onEdit={onEdit} onDelete={this._onDelete} userDeleted={userDeleted}/>);
        }
        return rows;
    }
}

let UserRow = (props) => {
    const user = props.user;
    return <tr>
        <td className='report-row'>
            <a href={'#/' + Routes.users.path + '/' + user.username}
               title={props.i18n('users.open-tooltip')}>{user.firstName + ' ' + user.lastName}</a>
        </td>
        <td className='report-row'>{user.username}</td>
        <td className='report-row'>{user.institution ? user.institution.name : ''}</td>
        <td className='report-row'>{user.emailAddress}</td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small' title={props.i18n('users.open-tooltip')}
                    onClick={() => props.onEdit(props.user)}>{props.i18n('open')}</Button>
            <Button bsStyle='warning' bsSize='small' title={props.i18n('users.delete-tooltip')}
                    onClick={() => props.onDelete(props.user)}>{props.i18n('delete')}{props.userDeleted.fetching && props.userDeleted.username === user.username &&
                <div className="loader"></div>}</Button>
        </td>
    </tr>;
};

UserRow.propTypes = {
    user: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    userDeleted: React.PropTypes.object
};

UserRow = injectIntl(I18nWrapper(UserRow));

export default injectIntl(I18nWrapper(UserTable));
