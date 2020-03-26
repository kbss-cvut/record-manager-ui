import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Button} from "react-bootstrap";
import * as moment from 'moment';
import PropTypes from "prop-types";

let HistoryRow = (props) => {
    const action = props.action;
    const username = action.author ? action.author.username : props.i18n('history.non-logged');
    return <tr>
        <td className='report-row'>{action.type}</td>
        <td className='report-row'>{username}</td>
        <td className='report-row'>{moment.unix(action.timestamp / 1000).format('DD-MM-YYYY HH:mm:ss:SSS')}</td>
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

export default injectIntl(I18nWrapper(HistoryRow));

