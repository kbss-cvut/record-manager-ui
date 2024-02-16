import React from "react";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {formatDateWithMilliseconds} from "../../utils/Utils";
import {useI18n} from "../../hooks/useI18n";

let HistoryRow = (props) => {
    const {i18n} = useI18n();
    const action = props.action;
    const username = action.author ? action.author.username : i18n('history.non-logged');
    return <tr>
        <td className='report-row'>{action.type}</td>
        <td className='report-row'>{username}</td>
        <td className='report-row'>{formatDateWithMilliseconds(action.timestamp)}</td>
        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={i18n('history.open-tooltip')}
                    onClick={() => props.onOpen(action.key)}>{i18n('open')}</Button>
        </td>
    </tr>;
};

HistoryRow.propTypes = {
    action: PropTypes.object.isRequired,
    onOpen: PropTypes.func.isRequired
};

export default HistoryRow;

