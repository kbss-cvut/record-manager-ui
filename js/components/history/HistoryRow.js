import React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {formatDateWithMilliseconds} from "../../utils/Utils";

let HistoryRow = (props) => {
    const action = props.action;
    const username = action.author ? action.author.username : props.i18n('history.non-logged');
    return <tr>
        <td className='report-row'>{action.type}</td>
        <td className='report-row'>{username}</td>
        <td className='report-row'>{formatDateWithMilliseconds(action.timestamp)}</td>
        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={props.i18n('history.open-tooltip')}
                    onClick={() => props.onOpen(action.key)}>{props.i18n('open')}</Button>
        </td>
    </tr>;
};

HistoryRow.propTypes = {
    action: PropTypes.object.isRequired,
    onOpen: PropTypes.func.isRequired
};

export default injectIntl(withI18n(HistoryRow));

