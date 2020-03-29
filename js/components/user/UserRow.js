import React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Button} from "react-bootstrap";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";

let UserRow = (props) => {
    const user = props.user;
    return <tr>
        <td className='report-row'>
            <Button variant="link" size="sm" className="text-left"
                    onClick={() => props.onEdit(props.user)}
                    title={props.i18n('users.open-tooltip')}>{user.firstName + ' ' + user.lastName}
            </Button>
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
    deletionLoading: PropTypes.bool.isRequired,
    i18n: PropTypes.func.isRequired,
};

export default injectIntl(withI18n(UserRow));
