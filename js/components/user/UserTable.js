import React from "react";
import {Table} from "react-bootstrap";
import DeleteItemDialog from "../DeleteItemDialog";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import UserRow from "./UserRow";
import PropTypes from "prop-types";
import IfInternalAuth from "../misc/oidc/IfInternalAuth";

class UserTable extends React.Component {
    static propTypes = {
        users: PropTypes.array.isRequired,
        handlers: PropTypes.object.isRequired
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
            <IfInternalAuth>
                <th className='w-20 content-center'>{this.i18n('actions')}</th>
            </IfInternalAuth>
        </tr>
        </thead>;
    }

    _renderUsers() {
        const {users} = this.props;
        const onEdit = this.props.handlers.onEdit;
        let rows = [];
        for (let i = 0, len = users.length; i < len; i++) {
            rows.push(<UserRow key={users[i].username} user={users[i]} onEdit={onEdit} onDelete={this._onDelete}/>);
        }
        return rows;
    }
}

export default injectIntl(withI18n(UserTable));
