import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Button} from "react-bootstrap";
import * as moment from 'moment';

let HistoryRow = (props) => {
    const action = props.action;
    return <tr>
        <td className='report-row'>{action.type}</td>
        <td className='report-row'>{action.author.username}</td>
        <td className='report-row'>{moment.unix(action.timestamp / 1000).format('DD-MM-YYYY HH:mm:ss:SSS')}</td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small' title={props.i18n('history.open-tooltip')}
                    onClick={() => props.onOpen()}>{props.i18n('open')}</Button>
        </td>
    </tr>;
};

HistoryRow.propTypes = {
    action: React.PropTypes.object.isRequired,
    onOpen: React.PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(HistoryRow));

