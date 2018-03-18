import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Button} from "react-bootstrap";
import {Routes} from "../../utils/Routes";

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
                    onClick={() => props.onDelete(props.user)}>{props.i18n('delete')}
                    {props.deletionLoading && <div className="loader"></div>}</Button>
        </td>
    </tr>;
};

UserRow.propTypes = {
    user: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    deletionLoading: React.PropTypes.bool.isRequired
};

export default injectIntl(I18nWrapper(UserRow));
