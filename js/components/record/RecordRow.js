import React from "react";
import {formatDate} from "../../utils/Utils";
import HelpIcon from "../HelpIcon";
import {Button} from "react-bootstrap";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import RecordValidator from "../../validation/RecordValidator";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {ROLE} from "../../constants/DefaultConstants";

let RecordRow = (props) => {
    const record = props.record,
        formTemplateOptions = props.formTemplateOptions,
        isComplete = RecordValidator.isComplete(record),
        completionTooltip = props.i18n(isComplete ? 'records.completion-status-tooltip.complete' : 'records.completion-status-tooltip.incomplete'),
        isAdmin = props.currentUser.role === ROLE.ADMIN,
        deleteButton = props.disableDelete ? null :
            <Button variant='warning' size='sm' title={props.i18n('records.delete-tooltip')}
                    onClick={() => props.onDelete(record)}>{props.i18n('delete')}{props.deletionLoading &&
            <LoaderSmall/>}</Button>;

    const recordKeyItem = isAdmin
        && <td className='report-row'>
            <Button variant="link" size="sm"
                    onClick={() => props.onEdit(record)}>{record.key}</Button>
        </td>;

    const formTemplateItem = isAdmin
        && <td className='report-row content-center'>
            {getFormTemplateOptionName(record.formTemplate, formTemplateOptions)}
        </td>;

    return <tr>
        {recordKeyItem}
        <td className='report-row'>
            <Button variant="link" size="sm"
                    onClick={() => props.onEdit(record)}>{record.localName}</Button>
        </td>
        {formTemplateItem}
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

const isAdvancedView = {}


const getFormTemplateOptionName = (formTemplate, formTemplatesOptions) => {
    if (!formTemplate) {
        return "";
    }
    const label = formTemplatesOptions.find(e => e.id === formTemplate)?.name;
    return label ? label : formTemplate;
}

RecordRow.propTypes = {
    i18n: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
    formTemplateOptions: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    disableDelete: PropTypes.bool.isRequired,
    deletionLoading: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
};

export default injectIntl(withI18n(RecordRow));
