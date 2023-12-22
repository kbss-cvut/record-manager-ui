import React from "react";
import {formatDate} from "../../utils/Utils";
import HelpIcon from "../HelpIcon";
import {Button} from "react-bootstrap";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {RECORD_PHASE, ROLE} from "../../constants/DefaultConstants";

let RecordRow = (props) => {
    const record = props.record,
        formTemplateOptions = props.formTemplateOptions,
        recordPhase = props.record.phase,
        isAdmin = props.currentUser.role === ROLE.ADMIN,
        deleteButton = props.disableDelete ? null :
            <Button variant='warning' size='sm' title={props.i18n('records.delete-tooltip')}
                    onClick={() => props.onDelete(record)}>{props.i18n('delete')}{props.deletionLoading &&
            <LoaderSmall/>}</Button>;

    const getGlyph = () => {
        switch (recordPhase) {
            case RECORD_PHASE.OPEN:
                return 'to-do';
            case RECORD_PHASE.COMPLETED:
                return 'ok';
            case RECORD_PHASE.PUBLISHED:
                return 'envelope';
            case RECORD_PHASE.REJECTED:
                return 'remove';
            default:
                return '';
        }
    };

    const getCompletionStatusTooltip = () => {
        switch (recordPhase) {
            case RECORD_PHASE.COMPLETED:
                return props.i18n('records.completion-status-tooltip.complete');
            case RECORD_PHASE.OPEN:
                return props.i18n('records.completion-status-tooltip.incomplete');
            case RECORD_PHASE.REJECTED:
                return props.i18n('records.completion-status-tooltip.rejected');
            case RECORD_PHASE.PUBLISHED:
                return props.i18n('records.completion-status-tooltip.published');
            default:
                return "";
        }
    };

    const phaseGlyph = getGlyph();

    return <tr>
        {isAdmin &&
            <td className='report-row'>
                <Button variant="link" size="sm"
                    onClick={() => props.onEdit(record)}>{record.key}</Button>
            </td>
        }
        <td className='report-row'>
            <Button variant="link" size="sm"
                    onClick={() => props.onEdit(record)}>{record.localName}</Button>
        </td>
        {isAdmin && 
              <td className='report-row'>{record.institution.name}</td>
        }
        {isAdmin &&
            <td className='report-row content-center'>
                {getFormTemplateOptionName(record.formTemplate, formTemplateOptions)}
            </td>
        }
        <td className='report-row content-center'>
            {formatDate(new Date(record.lastModified ? record.lastModified : record.dateCreated))}
        </td>
        <td className='report-row content-center'>
            {phaseGlyph ? <HelpIcon text={getCompletionStatusTooltip()} glyph={getGlyph()}/> : "N/A"}
        </td>

        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={props.i18n('records.open-tooltip')}
                    onClick={() => props.onEdit(record)}>{props.i18n('open')}</Button>
            {deleteButton}
        </td>
    </tr>
};

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
