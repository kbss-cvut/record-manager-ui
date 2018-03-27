'use strict';

import React from 'react';
import {Button, Panel, Table} from 'react-bootstrap';

import injectInl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import DeleteItemDialog from "../DeleteItemDialog";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import Loader from "../Loader";
import AlertMessage from "../AlertMessage";

class InstitutionMembers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showDialog: false,
            showAlert: false,
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
        this.props.onDelete(this.state.selectedUser);
        this.setState({showDialog: false, selectedUser: null, showAlert: true});
    };

    _getDeleteLabel() {
        const user = this.state.selectedUser;
        return user ? user.username : '';
    }

    render(){
        const {institutionMembers, institution, currentUser, onAddNewUser, userDeleted} = this.props;
        if(!institutionMembers.members && (!institutionMembers.status || institutionMembers.status === ACTION_STATUS.PENDING)) {
            return <Loader />
        } else if(institutionMembers.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('institution.members.loading-error', {error: institutionMembers.error.message})}/>
        }
        return <Panel header={<span>{this.props.i18n('institution.members.panel-title')}</span>} bsStyle='info'>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedUser}
                              itemLabel={this._getDeleteLabel()}/>
            {institutionMembers.members.length > 0 ?
                <Table responsive striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th className='col-xs-4 content-center'>{this.props.i18n('name')}</th>
                        <th className='col-xs-2 content-center'>{this.props.i18n('login.username')}</th>
                        <th className='col-xs-4 content-center'>{this.props.i18n('users.email')}</th>
                        <th className='col-xs-2 content-center'>{this.props.i18n('table-actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this._renderRows()}
                    </tbody>
                </Table>
                :
                <p className="font-italic">{this.props.i18n('institution.members.not-found')}</p>
            }
            {currentUser.role === ROLE.ADMIN &&
                <div className="btn-toolbar">
                    <Button bsStyle='primary' className="btn-sm" onClick={() => onAddNewUser(institution)}>
                        {this.props.i18n('users.add-new-user')}
                    </Button>
                </div>
            }
            {this.state.showAlert && userDeleted.status === ACTION_STATUS.ERROR &&
            <AlertMessage type={ALERT_TYPES.DANGER}
                          message={this.props.formatMessage('user.delete-error', {error: this.props.userDeleted.error.message})}/>}
            {this.state.showAlert && userDeleted.status === ACTION_STATUS.SUCCESS &&
            <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.props.i18n('user.delete-success')}/>}
        </Panel>;
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
                    <Button bsStyle='primary' bsSize='small' title={this.props.i18n('users.open-tooltip')}
                            onClick={() => onEditUser(member, institution)}>
                        {this.props.i18n('open')}
                    </Button>
                    {currentUser.role === ROLE.ADMIN &&
                        <Button bsStyle='warning' bsSize='small' title={this.props.i18n('users.delete-tooltip')}
                                onClick={() => this._onDelete(member)}>
                            {this.props.i18n('delete')}{deletionLoading && <div className="loader"></div>}
                        </Button>}
                </td>
            </tr>);
        }
        return rows;
    }
}

InstitutionMembers.propTypes = {
    institutionMembers: React.PropTypes.object.isRequired,
    institution: React.PropTypes.object.isRequired,
    onEditUser: React.PropTypes.func.isRequired,
    onAddNewUser: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object.isRequired,
    userDeleted: React.PropTypes.object
};

export default injectInl(I18nWrapper(InstitutionMembers));
