import React from "react";
import { formatDate } from "../../utils/Utils";
import HelpIcon from "../HelpIcon";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { COLUMNS, RECORD_PHASE, ROLE } from "../../constants/DefaultConstants";
import { useI18n } from "../../hooks/useI18n";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { useHistory } from "react-router-dom";

const StatusInfo = {};
StatusInfo[RECORD_PHASE.OPEN] = {
  glyph: "to-do",
  tooltip: "records.completion-status-tooltip.incomplete",
};
StatusInfo[RECORD_PHASE.COMPLETED] = {
  glyph: "ok",
  tooltip: "records.completion-status-tooltip.complete",
};
StatusInfo[RECORD_PHASE.PUBLISHED] = {
  glyph: "envelope",
  tooltip: "records.completion-status-tooltip.published",
};
StatusInfo[RECORD_PHASE.REJECTED] = {
  glyph: "remove",
  tooltip: "records.completion-status-tooltip.rejected",
};

const RecordRow = (props) => {
  const { i18n } = useI18n();
  const history = useHistory();

  const record = props.record,
    formTemplateOptions = props.formTemplateOptions,
    deleteButton = props.disableDelete ? null : (
      <Button variant="warning" size="sm" title={i18n("records.delete-tooltip")} onClick={() => props.onDelete(record)}>
        {i18n("delete")}
      </Button>
    );
  const statusInfo = StatusInfo[record.phase];

  const statusInfoText = () => {
    if (record.rejectReason) {
      return `${i18n(statusInfo.tooltip)}\n${i18n("reason")}: ${record.rejectReason}`;
    } else {
      return `${i18n(statusInfo.tooltip)}`;
    }
  };

  return (
    <tr className="position-relative">
      {props.visibleColumns.includes(COLUMNS.ID) && (
        <td className="report-row content-center">
          <Button variant="link" size="sm" onClick={() => props.onEdit(record)}>
            {record.key}
          </Button>
        </td>
      )}

      {props.visibleColumns.includes(COLUMNS.NAME) && (
        <td className="report-row content-center">
          <Button variant="link" size="sm" onClick={() => props.onEdit(record)}>
            {record.localName}
          </Button>
        </td>
      )}

      {props.visibleColumns.includes(COLUMNS.AUTHOR) && (
        <td className="report-row content-center">
          {record.author.firstName && record.author.lastName ? (
            <Button variant="link" size="sm" onClick={() => history.push(`/users/${record.author.username}`)}>
              {`${record.author.firstName} ${record.author.lastName}`}
            </Button>
          ) : (
            "—"
          )}
        </td>
      )}

      {props.visibleColumns.includes(COLUMNS.INSTITUTION) && (
        <td className="report-row content-center">{record.institution ? record.institution.name : "—"}</td>
      )}

      {props.visibleColumns.includes(COLUMNS.TEMPLATE) && (
        <td className="report-row content-center">
          {getFormTemplateOptionName(record.formTemplate, formTemplateOptions)}
        </td>
      )}

      {props.visibleColumns.includes(COLUMNS.LAST_MODIFIED) && (
        <td className="report-row content-center">
          {formatDate(new Date(record.lastModified ? record.lastModified : record.dateCreated))}
        </td>
      )}

      {props.visibleColumns.includes(COLUMNS.STATUS) && (
        <td className="report-row content-center">
          {statusInfo ? <HelpIcon text={statusInfoText()} glyph={statusInfo.glyph} /> : "N/A"}
        </td>
      )}
      <td className="report-row actions">
        <PromiseTrackingMask area={`record-${record.key}`} />
        <Button variant="primary" size="sm" title={i18n("records.open-tooltip")} onClick={() => props.onEdit(record)}>
          {i18n("open")}
        </Button>
        {deleteButton}
      </td>
    </tr>
  );
};

const getFormTemplateOptionName = (formTemplate, formTemplatesOptions) => {
  if (!formTemplate) {
    return "";
  }
  const label = formTemplatesOptions.find((e) => e.id === formTemplate)?.name;
  return label ? label : formTemplate;
};

RecordRow.propTypes = {
  record: PropTypes.object.isRequired,
  formTemplateOptions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disableDelete: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  visibleColumns: PropTypes.array.isRequired,
};

export default RecordRow;
