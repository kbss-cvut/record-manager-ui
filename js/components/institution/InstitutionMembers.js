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
        this.props.onDelete(this.state.selectedItem, this.props.institution.key);
        this.setState({showDialog: false, selectedItem: null});
    };

    _getDeleteLabel() {
        const user = this.state.selectedItem;
        return user ? user.username : '';
    }

    render(){
        const {institutionMembers, institution, currentUser, onAddNewUser} = this.props;
        if(!institutionMembers.status || institutionMembers.status === ACTION_STATUS.PENDING) {
            return <Loader />
        } else if(institutionMembers.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('institution.members.loading-error', {error: institutionMembers.error.message})}/>
        }

        return <Panel header={<h3>{this.props.i18n('institution.members.panel-title')}</h3>} bsStyle='info'>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedItem}
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
        </Panel>;
    };

    _renderRows() {
        const {institution, onEditUser, currentUser} = this.props;
        let rows = [];
        const members = this.props.institutionMembers.members;
        for (let i = 0, len = members.length; i < len; i++) {
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
                    {currentUser.role === ROLE.ADMIN && <Button bsStyle='warning' bsSize='small' title={this.props.i18n('users.delete-tooltip')}
                                                                onClick={() => this._onDelete(member)}>{this.props.i18n('delete')}</Button>}
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
    currentUser: React.PropTypes.object.isRequired
};

export default injectInl(I18nWrapper(InstitutionMembers));
