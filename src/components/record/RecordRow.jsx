import React, { useMemo } from "react";
import { formatDate } from "../../utils/Utils";
import HelpIcon from "../HelpIcon";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { RECORD_PHASE, ROLE } from "../../constants/DefaultConstants";
import { useI18n } from "../../hooks/useI18n";
import { IfGranted } from "react-authorization";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

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
  const record = props.record,
    formTemplateOptions = props.formTemplateOptions,
    deleteButton = props.disableDelete ? null : (
      <Button variant="warning" size="sm" title={i18n("records.delete-tooltip")} onClick={() => props.onDelete(record)}>
        {i18n("delete")}
      </Button>
    );
  const statusInfo = StatusInfo[record.phase];

  const statusInfoText = () => {
    if (record.rejectMessage) {
      return `${i18n(statusInfo.tooltip)}\n${i18n("reason")}: ${record.rejectMessage}`;
    } else {
      return `${i18n(statusInfo.tooltip)}`;
    }
  };

  return (
    <tr className="position-relative">
      <IfGranted expected={ROLE.ADMIN} actual={props.currentUser.role}>
        <td className="report-row">
          <Button variant="link" size="sm" onClick={() => props.onEdit(record)}>
            {record.key}
          </Button>
        </td>
      </IfGranted>
      <td className="report-row">
        <Button variant="link" size="sm" onClick={() => props.onEdit(record)}>
          {record.localName}
        </Button>
      </td>
      <IfGranted expected={ROLE.ADMIN} actual={props.currentUser.role}>
        <td className="report-row content-center">{record.institution.name}</td>
        <td className="report-row content-center">
          {getFormTemplateOptionName(record.formTemplate, formTemplateOptions)}
        </td>
      </IfGranted>
      <td className="report-row content-center">
        {formatDate(new Date(record.lastModified ? record.lastModified : record.dateCreated))}
      </td>
      <td className="report-row content-center">
        {statusInfo ? <HelpIcon text={statusInfoText()} glyph={statusInfo.glyph} /> : "N/A"}
      </td>
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
};

export default RecordRow;
