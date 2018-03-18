import RecordValidator from "../../validation/RecordValidator";
import React from "react";
import {formatDate} from "../../utils/Utils";
import {Routes} from "../../utils/Routes";
import HelpIcon from "../HelpIcon";
import {Button} from "react-bootstrap";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";

let RecordRow = (props) => {
    const record = props.record,
        isComplete = RecordValidator.isComplete(record),
        completionTooltip = props.i18n(isComplete ? 'records.completion-status-tooltip.complete' : 'records.completion-status-tooltip.incomplete'),
        deleteButton = props.disableDelete ? null :
            <Button bsStyle='warning' bsSize='small' title={props.i18n('records.delete-tooltip')}
                    onClick={() => props.onDelete(record)}>{props.i18n('delete')}{props.deletionLoading && <div className="loader"></div>}</Button>;
    return <tr>
        <td className='report-row'><a href={'#/' + Routes.records.path + '/' + record.key}>{record.key}</a></td>
        <td className='report-row'><a href={'#/' + Routes.records.path + '/' + record.key}>{record.localName}</a></td>
        <td className='report-row content-center'>
            {formatDate(new Date(record.lastModified ? record.lastModified : record.dateCreated))}
        </td>
        <td className='report-row content-center'>
            <HelpIcon text={completionTooltip} glyph={isComplete ? 'ok' : 'remove'}/>
        </td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small' title={props.i18n('records.open-tooltip')}
                    onClick={() => props.onEdit(record)}>{props.i18n('open')}</Button>
            {deleteButton}
        </td>
    </tr>
};

RecordRow.propTypes = {
    record: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    disableDelete: React.PropTypes.bool.isRequired,
    deletionLoading: React.PropTypes.bool.isRequired
};

export default injectIntl(I18nWrapper(RecordRow));
