'use strict';

import React from "react";
import {Table} from "react-bootstrap";
import DeleteItemDialog from "../DeleteItemDialog";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import UserRow from "./UserRow";
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import PropTypes from "prop-types";

class UserTable extends React.Component {
    static propTypes = {
        users: PropTypes.array.isRequired,
        handlers: PropTypes.object.isRequired,
        userDeleted: PropTypes.object
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
            {this.props.users.length > 0 ?
                <Table size="sm" responsive striped bordered hover>
                    {this._renderHeader()}
                    <tbody>
                    {this._renderUsers()}
                    </tbody>
                </Table>
                :
                <p className="font-italic">{this.i18n('users.not-found')}</p>
            }
        </div>;
    }

    _getDeleteLabel() {
        const user = this.state.selectedUser;
        return user ? user.firstName + ' ' + user.lastName : '';
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='w-20 content-center'>{this.i18n('name')}</th>
            <th className='w-20 content-center'>{this.i18n('login.username')}</th>
            <th className='w-20 content-center'>{this.i18n('institution.name')}</th>
            <th className='w-20 content-center'>{this.i18n('users.email')}</th>
            <th className='w-20 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>;
    }

    _renderUsers() {
        const {users, userDeleted} = this.props;
        const onEdit = this.props.handlers.onEdit;
        let rows = [];
        for (let i = 0, len = users.length; i < len; i++) {
            rows.push(<UserRow key={users[i].username} user={users[i]} onEdit={onEdit} onDelete={this._onDelete}
                               deletionLoading={!!(userDeleted.status === ACTION_STATUS.PENDING
                                   && userDeleted.username === users[i].username)}/>);
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(UserTable));
