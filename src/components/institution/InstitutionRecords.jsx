import React from "react";
import { Card } from "react-bootstrap";
import RecordTable from "../record/RecordTable";
import PropTypes from "prop-types";
import ExportRecordsDropdown from "../record/ExportRecordsDropdown";
import { useI18n } from "../../hooks/useI18n";
import { COLUMNS } from "../../constants/DefaultConstants.js";

const InstitutionRecords = (props) => {
  const { recordsLoaded, formTemplatesLoaded, onEdit, onExport, currentUser, filterAndSort } = props;
  const { i18n } = useI18n();

  return (
    <Card variant="info" className="mt-3">
      <Card.Header className="text-light bg-primary" as="h6">
        {i18n("institution.records.panel-title")}
      </Card.Header>
      <Card.Body>
        <RecordTable
          visibleColumns={Object.values(COLUMNS)}
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          handlers={{ onEdit: onEdit }}
          disableDelete={true}
          filterAndSort={filterAndSort}
          currentUser={currentUser}
        />
        <div className="d-flex justify-content-end">
          <ExportRecordsDropdown onExport={onExport} records={recordsLoaded.records} />
        </div>
      </Card.Body>
    </Card>
  );
};

InstitutionRecords.propTypes = {
  recordsLoaded: PropTypes.object.isRequired,
  formTemplatesLoaded: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  filterAndSort: PropTypes.object.isRequired,
};

export default InstitutionRecords;
