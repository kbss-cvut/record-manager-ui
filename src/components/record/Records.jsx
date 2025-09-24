import React, { useState } from "react";
import { Alert, Button, Card, OverlayTrigger, Popover } from "react-bootstrap";
import { injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import { ROLE } from "../../constants/DefaultConstants";
import PropTypes from "prop-types";
import { processTypeaheadOptions } from "./TypeaheadAnswer";
import ExportRecordsDropdown from "./ExportRecordsDropdown";
import ImportRecordsDialog from "./ImportRecordsDialog";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { trackPromise } from "react-promise-tracker";
import RecordTable from "./RecordTable";
import Pagination from "../misc/Pagination";
import { hasRole } from "../../utils/RoleUtils.js";

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

  return (
    <Card variant="primary">
      <PromiseTrackingMask area="records" />
      <Card.Header className="text-light bg-primary" as="h6">
        {getPanelTitle()}
      </Card.Header>
      <Card.Body>
        {recordsLoaded.records && recordsLoaded.records.length > 0 ? (
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
              }}
            />
            <Pagination {...pagination} />
          </>
        ) : (
          <Alert variant="warning">{i18n("records.no-records")}</Alert>
        )}

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
