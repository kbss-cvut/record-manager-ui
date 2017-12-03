'use strict';

import React from 'react';
import {Button, Panel, Table} from 'react-bootstrap';

import injectInl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';

const InstitutionMembers = (props) => {
    var members = props.members;

    var rows = [],
        member;
    for (var i = 0, len = members.length; i < len; i++) {
        member = members[i];
        rows.push(<tr key={member.username}>
            <td className='report-row'>{member.firstName + ' ' + member.lastName}</td>
            <td className='report-row'>{member.username}</td>
            <td className='report-row'>{member.emailAddress}</td>
            <td className='content-center'>
                <Button bsStyle='warning' bsSize='small' onClick={() => props.onEditUser(member, props.institution)}>
                    {props.i18n('table-edit')}
                </Button>
            </td>
        </tr>);
    }

    return <Panel header={<h3>{props.i18n('institution.members.panel-title')}</h3>} bsStyle='info'>
        {members.length > 0 &&
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th className='col-xs-4 content-center'>{props.i18n('name')}</th>
                    <th className='col-xs-3 content-center'>{props.i18n('login.username')}</th>
                    <th className='col-xs-4 content-center'>{props.i18n('users.email')}</th>
                    <th className='col-xs-1 content-center'>{props.i18n('table-actions')}</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        }
        <div className="btn-toolbar">
            <Button bsStyle='primary' className="btn-sm" onClick={() => props.onAddNewUser(props.institution)}>
                {props.i18n('users.add-new-user')}
            </Button>
            <Button bsStyle='primary' className="btn-sm" onClick={() => props.onAddExistingUser(props.institution)}>
                {props.i18n('users.add-existing-user')}
            </Button>
        </div>
    </Panel>;
};

InstitutionMembers.propTypes = {
    members: React.PropTypes.array.isRequired,
    institution: React.PropTypes.object.isRequired,
    onEditUser: React.PropTypes.func.isRequired,
    onAddNewUser: React.PropTypes.func.isRequired,
    onAddExistingUser: React.PropTypes.func.isRequired
};

export default injectInl(I18nWrapper(InstitutionMembers));
