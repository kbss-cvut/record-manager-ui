import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Button} from "react-bootstrap";
import {Routes} from "../../utils/Routes";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';

let UserRow = (props) => {
    const user = props.user;
    return <tr>
        <td className='report-row'>
            <Link to={Routes.users.path + '/' + user.username}
                  title={props.i18n('users.open-tooltip')}>{user.firstName + ' ' + user.lastName}</Link>
        </td>
        <td className='report-row'>{user.username}</td>
        <td className='report-row'>{user.institution ? user.institution.name : ''}</td>
        <td className='report-row'>{user.emailAddress}</td>
        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={props.i18n('users.open-tooltip')}
                    onClick={() => props.onEdit(props.user)}>{props.i18n('open')}</Button>
            <Button variant='warning' size='sm' title={props.i18n('users.delete-tooltip')}
                    onClick={() => props.onDelete(props.user)}>{props.i18n('delete')}
                {props.deletionLoading && <LoaderSmall/>}</Button>
        </td>
    </tr>;
};

UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    deletionLoading: PropTypes.bool.isRequired
};

export default injectIntl(I18nWrapper(UserRow));
