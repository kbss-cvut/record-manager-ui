import React from 'react';
import {Button, Card, Table} from 'react-bootstrap';
import {injectIntl} from "react-intl";
import withI18n from '../../i18n/withI18n';
import DeleteItemDialog from "../DeleteItemDialog";
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import Loader, {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {isAdmin} from "../../utils/SecurityUtils";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

class InstitutionMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            selectedUser: null
        };
        this.i18n = this.props.i18n;
    }

    _onDelete = (user) => {
        this.setState({showDialog: true, selectedUser: user});
    };

    _onCancelDelete = () => {
        this.setState({showDialog: false, selectedUser: null});
    };

    _onSubmitDelete = () => {
        this.props.onDelete(this.state.selectedUser);
        this.setState({showDialog: false, selectedUser: null, showAlert: true});
    };

    _getDeleteLabel() {
        const user = this.state.selectedUser;
        return user ? user.username : '';
    }

    render() {
        const {institutionMembers, institution, currentUser, onAddNewUser} = this.props;
        if (!institutionMembers.members && (!institutionMembers.status || institutionMembers.status === ACTION_STATUS.PENDING)) {
            return <Loader/>
        }

        return <Card variant='info' className="mt-3">
            <Card.Header className="text-light bg-primary"
                         as="h6">{this.i18n('institution.members.panel-title')}</Card.Header>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedUser}
                              itemLabel={this._getDeleteLabel()}/>
            <Card.Body>
                <PromiseTrackingMask area="institution-members"/>
                {institutionMembers.members.length > 0 ?
                    <Table size="sm" responsive striped bordered hover>
                        <thead>
                        <tr>
                            <th className='w-30 content-center'>{this.i18n('name')}</th>
                            <th className='w-20 content-center'>{this.i18n('login.username')}</th>
                            <th className='w-30 content-center'>{this.i18n('users.email')}</th>
                            <th className='w-20 content-center'>{this.i18n('table-actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this._renderRows()}
                        </tbody>
                    </Table>
                    :
                    <p className="font-italic">{this.i18n('institution.members.not-found')}</p>
                }
                {isAdmin(currentUser) &&
                    <div className="btn-toolbar">
                        <Button variant='primary' size="sm" onClick={() => onAddNewUser(institution)}>
                            {this.i18n('users.add-new-user')}
                        </Button>
                    </div>
                }
            </Card.Body>
        </Card>;
    }

    _renderRows() {
        const {institution, onEditUser, currentUser, userDeleted} = this.props;
        let rows = [];
        const members = this.props.institutionMembers.members;
        for (let i = 0, len = members.length; i < len; i++) {
            const deletionLoading = !!(userDeleted.status === ACTION_STATUS.PENDING && userDeleted.username === members[i].username);
            const member = members[i];
            rows.push(<tr key={member.username}>
                <td className='report-row'>{member.firstName + ' ' + member.lastName}</td>
                <td className='report-row'>{member.username}</td>
                <td className='report-row'>{member.emailAddress}</td>
                <td className='report-row actions'>
                    <Button variant='primary' size='sm' title={this.i18n('users.open-tooltip')}
                            className='action-button' onClick={() => onEditUser(member, institution)}>
                        {this.i18n('open')}
                    </Button>
                    {isAdmin(currentUser) &&
                        <Button variant='warning' size='sm' title={this.i18n('users.delete-tooltip')}
                                className='action-button' onClick={() => this._onDelete(member)}>
                            {this.i18n('delete')}{deletionLoading && <LoaderSmall/>}
                        </Button>}
                </td>
            </tr>);
        }
        return rows;
    }
}

InstitutionMembers.propTypes = {
    institutionMembers: PropTypes.object.isRequired,
    institution: PropTypes.object.isRequired,
    onEditUser: PropTypes.func.isRequired,
    onAddNewUser: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    userDeleted: PropTypes.object
};

export default injectIntl(withI18n(InstitutionMembers));
