'use strict';

import React from 'react';
import {Button, Card, Table} from 'react-bootstrap';

import injectInl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import DeleteItemDialog from "../DeleteItemDialog";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import Loader, {LoaderSmall} from "../Loader";
import AlertMessage from "../AlertMessage";
import PropTypes from "prop-types";

class InstitutionMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            showAlert: false,
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
        const {institutionMembers, institution, currentUser, onAddNewUser, userDeleted} = this.props;
        if (!institutionMembers.members && (!institutionMembers.status || institutionMembers.status === ACTION_STATUS.PENDING)) {
            return <Loader/>
        } else if (institutionMembers.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('institution.members.loading-error', {error: institutionMembers.error.message})}/>
        }
        return <Card variant='info' className="mt-3">
            <Card.Header className="text-light bg-primary"
                         as="h6">{this.i18n('institution.members.panel-title')}</Card.Header>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedUser}
                              itemLabel={this._getDeleteLabel()}/>
            <Card.Body>
                {institutionMembers.members.length > 0 ?
                    <Table size="sm" responsive striped bordered hover>
                        <thead>
                        <tr>
                            <th className='col-xs-4 content-center'>{this.i18n('name')}</th>
                            <th className='col-xs-2 content-center'>{this.i18n('login.username')}</th>
                            <th className='col-xs-4 content-center'>{this.i18n('users.email')}</th>
                            <th className='col-xs-2 content-center'>{this.i18n('table-actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this._renderRows()}
                        </tbody>
                    </Table>
                    :
                    <p className="font-italic">{this.i18n('institution.members.not-found')}</p>
                }
                {currentUser.role === ROLE.ADMIN &&
                <div className="btn-toolbar">
                    <Button variant='primary' size="sm" onClick={() => onAddNewUser(institution)}>
                        {this.i18n('users.add-new-user')}
                    </Button>
                </div>
                }
                {this.state.showAlert && userDeleted.status === ACTION_STATUS.ERROR &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('user.delete-error', {error: this.i18n(this.props.userDeleted.error.message)})}/>}
                {this.state.showAlert && userDeleted.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('user.delete-success')}/>}
            </Card.Body>
        </Card>;
    };

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
                            onClick={() => onEditUser(member, institution)}>
                        {this.i18n('open')}
                    </Button>
                    {currentUser.role === ROLE.ADMIN &&
                    <Button variant='warning' size='sm' title={this.i18n('users.delete-tooltip')}
                            onClick={() => this._onDelete(member)}>
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

export default injectInl(I18nWrapper(InstitutionMembers));
