import React from "react";
import {formatDate} from "../../utils/Utils";
import HelpIcon from "../HelpIcon";
import {Button} from "react-bootstrap";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import RecordValidator from "../../validation/RecordValidator";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";

let RecordRow = (props) => {
    const record = props.record,
        formTypeOptions = props.formTypeOptions,
        isComplete = RecordValidator.isComplete(record),
        completionTooltip = props.i18n(isComplete ? 'records.completion-status-tooltip.complete' : 'records.completion-status-tooltip.incomplete'),
        deleteButton = props.disableDelete ? null :
            <Button variant='warning' size='sm' title={props.i18n('records.delete-tooltip')}
                    onClick={() => props.onDelete(record)}>{props.i18n('delete')}{props.deletionLoading &&
            <LoaderSmall/>}</Button>;

    return <tr>
        <td className='report-row'>
            <Button variant="link" size="sm"
                    onClick={() => props.onEdit(record)}>{record.localName}</Button>
        </td>
        <td className='report-row content-center'>
            {getFormTypeOptionName(record.formType, formTypeOptions)}
        </td>
        <td className='report-row content-center'>
            {formatDate(new Date(record.lastModified ? record.lastModified : record.dateCreated))}
        </td>
        <td className='report-row content-center'>
            <HelpIcon text={completionTooltip} glyph={isComplete ? 'ok' : 'remove'}/>
        </td>
        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={props.i18n('records.open-tooltip')}
                    onClick={() => props.onEdit(record)}>{props.i18n('open')}</Button>
            {deleteButton}
        </td>
    </tr>
};

const getFormTypeOptionName = (formType, formTypesOptions) => {
    if (!formType) {
        return "";
    }
    const label = formTypesOptions.find(e => e.id === formType)?.name;
    return label ? label : formType;
}

RecordRow.propTypes = {
    i18n: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
    formTypeOptions: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    disableDelete: PropTypes.bool.isRequired,
    deletionLoading: PropTypes.bool.isRequired
};

export default injectIntl(withI18n(RecordRow));
