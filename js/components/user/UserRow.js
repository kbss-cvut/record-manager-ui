import React from "react";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import IfInternalAuth from "../misc/oidc/IfInternalAuth";
import {useI18n} from "../../hooks/useI18n";

let UserRow = (props) => {
    const user = props.user;
    const {i18n} = useI18n();
    return <tr>
        <td className='report-row'>
            <Button variant="link" size="sm" className="text-left"
                    onClick={() => props.onEdit(props.user)}
                    title={i18n('users.open-tooltip')}>{user.firstName + ' ' + user.lastName}
            </Button>
        </td>
        <td className='report-row'>{user.username}</td>
        <td className='report-row'>{user.institution ? user.institution.name : ''}</td>
        <td className='report-row'>{user.emailAddress}</td>
        <IfInternalAuth>
            <td className='report-row actions'>
                <Button variant='primary' size='sm' title={i18n('users.open-tooltip')}
                        onClick={() => props.onEdit(props.user)}>{i18n('open')}</Button>
                <Button variant='warning' size='sm' title={i18n('users.delete-tooltip')}
                        onClick={() => props.onDelete(props.user)}>{i18n('delete')}
                </Button>
            </td>
        </IfInternalAuth>
    </tr>;
};

UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default UserRow;
