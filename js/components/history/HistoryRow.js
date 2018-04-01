import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Routes} from "../../utils/Routes";
import {Button} from "react-bootstrap";

let HistoryRow = (props) => {
    const historyAction = props.historyAction;
    return <tr>
        <td className='report-row'>{historyAction.type}</td>
        <td className='report-row'>{historyAction.owner}</td>
        <td className='report-row'>{historyAction.time}</td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small' title={props.i18n('history.open-tooltip')}
                    onClick={() => props.onEdit(props.historyAction)}>{props.i18n('open')}</Button>
        </td>
    </tr>;
};

HistoryRow.propTypes = {
    historyAction: React.PropTypes.object.isRequired,
    onOpen: React.PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(HistoryRow));

