import React, { useState } from "react";
import { Alert, Button, Card, OverlayTrigger, Popover } from "react-bootstrap";
import { injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import { COLUMNS, ROLE } from "../../constants/DefaultConstants";
import PropTypes from "prop-types";
import { processTypeaheadOptions } from "./TypeaheadAnswer";
import ExportRecordsDropdown from "./ExportRecordsDropdown";
import ImportRecordsDialog from "./ImportRecordsDialog";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { trackPromise } from "react-promise-tracker";
import RecordTable from "./RecordTable";
import Pagination from "../misc/Pagination";
import { hasRole } from "../../utils/RoleUtils.js";
import { FaTableColumns } from "react-icons/fa6";

const STUDY_CLOSED_FOR_ADDITION = false;
const STUDY_CREATE_AT_MOST_ONE_RECORD = false;

const Records = ({
  i18n,
  intl,
  recordsLoaded,
  recordDeleted,
  handlers,
  currentUser,
  formTemplatesLoaded,
  pagination,
  filterAndSort,
  formTemplate,
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("visibleColumns");
    return saved ? JSON.parse(saved) : Object.values(COLUMNS);
  });

  const openImportDialog = () => {
    setShowImportDialog(true);
  };

  const closeImportDialog = () => {
    setShowImportDialog(false);
  };

  const onImport = (file) => {
    closeImportDialog();
    trackPromise(handlers.onImport(file));
  };

  const getFormTemplateName = () => {
    if (formTemplate) {
      const formTemplateOptions = formTemplatesLoaded.formTemplates
        ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
        : [];
      return formTemplateOptions.find((r) => r.id === formTemplate)?.name;
    }
  };

  const getPanelTitle = () => {
    if (!hasRole(currentUser, ROLE.READ_ALL_RECORDS) && formTemplate) {
      const formTemplateName = getFormTemplateName();
      if (formTemplateName) {
        return formTemplateName;
      }
    }
    return i18n("records.panel-title");
  };

  const showCreateButton = STUDY_CREATE_AT_MOST_ONE_RECORD
    ? !recordsLoaded.records || recordsLoaded.records.length < 1
    : true;
  const showPublishButton = hasRole(currentUser, ROLE.PUBLISH_RECORDS);
  const createRecordDisabled = STUDY_CLOSED_FOR_ADDITION && !hasRole(currentUser, ROLE.WRITE_ALL_RECORDS);
  const createRecordTooltip = i18n(
    createRecordDisabled ? "records.closed-study.create-tooltip" : "records.opened-study.create-tooltip",
  );
  const onCreateWithFormTemplate = () => handlers.onCreate(formTemplate);

  const toggleColumn = (id) => {
    setVisibleColumns((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((colId) => colId !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem("visibleColumns", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Card variant="primary">
      <PromiseTrackingMask area="records" />
      <Card.Header className="text-light bg-primary d-flex justify-content-between align-items-center" as="h6">
        {getPanelTitle()}
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          rootClose
          overlay={
            <Popover id="columns-popover">
              <Popover.Header as="h3">Choose columns</Popover.Header>
              <Popover.Body>
                {Object.entries(COLUMNS).map(([key, value]) => (
                  <div key={key} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={key}
                      checked={visibleColumns.includes(value)}
                      onChange={() => toggleColumn(value)}
                    />
                    <label className="form-check-label" htmlFor={key}>
                      {value}
                    </label>
                  </div>
                ))}
              </Popover.Body>
            </Popover>
          }
        >
          <Button variant="light" size="sm" title="Choose columns" className="btn-levitate">
            <FaTableColumns />
          </Button>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body>
        <>
          <RecordTable
            {...{
              recordsLoaded,
              recordDeleted,
              handlers,
              currentUser,
              formTemplatesLoaded,
              pagination,
              filterAndSort,
              formTemplate,
              visibleColumns,
            }}
          />
          <Pagination {...pagination} />
        </>
        <ImportRecordsDialog show={showImportDialog} onSubmit={onImport} onCancel={closeImportDialog} />
        <div className="d-flex justify-content-between">
          <div>
            {showCreateButton ? (
              <Button
                id="records-create"
                className="me-1 action-button"
                variant="primary"
                size="sm"
                disabled={createRecordDisabled}
                title={createRecordTooltip}
                onClick={onCreateWithFormTemplate}
              >
                {i18n("records.create-tile")}
              </Button>
            ) : null}
            <Button
              id="records-import"
              className="mx-1 action-button"
              variant="primary"
              size="sm"
              onClick={openImportDialog}
            >
              {i18n("records.import")}
            </Button>
            {showPublishButton ? (
              <Button
                id="records-publish"
                className="mx-1 action-button"
                variant="success"
                size="sm"
                onClick={handlers.onPublish}
              >
                {i18n("publish")}
              </Button>
            ) : null}
          </div>
          <ExportRecordsDropdown id="records-export" onExport={handlers.onExport} records={recordsLoaded.records} />
        </div>
      </Card.Body>
    </Card>
  );
};

Records.propTypes = {
  i18n: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  recordsLoaded: PropTypes.object,
  recordDeleted: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  formTemplatesLoaded: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  filterAndSort: PropTypes.object.isRequired,
  formTemplate: PropTypes.string,
};

export default injectIntl(withI18n(Records));
