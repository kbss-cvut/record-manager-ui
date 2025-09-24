import React, { useState } from "react";
import { OverlayTrigger, Popover, Table } from "react-bootstrap";
import DeleteItemDialog from "../DeleteItemDialog";
import { injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import RecordRow from "./RecordRow";
import PropTypes from "prop-types";
import { processTypeaheadOptions } from "./TypeaheadAnswer";
import { IfGranted } from "react-authorization";
import { ROLE } from "../../constants/DefaultConstants";
import DateIntervalFilter from "./filter/DateIntervalFilter";
import PhaseFilter from "./filter/PhaseFilter";
import InstitutionFilter from "./filter/InstitutionFilter";
import TemplateFilter from "./filter/TemplateFilter.jsx";
import SortIndicator from "../misc/SortIndicator";
import { useI18n } from "../../hooks/useI18n";
import FilterIndicator from "../misc/FilterIndicator";
import { sanitizeArray } from "../../utils/Utils";

const RecordTable = ({
  intl,
  i18n,
  recordsLoaded,
  formTemplate,
  formTemplatesLoaded,
  handlers,
  recordDeleted,
  disableDelete = false,
  currentUser,
  filterAndSort,
}) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const onDelete = (record) => {
    setSelectedRecord(record);
  };

  const onCancelDelete = () => {
    setSelectedRecord(null);
  };

  const onSubmitDelete = () => {
    handlers.onDelete(selectedRecord);
    setSelectedRecord(null);
  };

  const getDeleteLabel = () => {
    return selectedRecord ? selectedRecord.localName : "";
  };

  const getFormTemplateRecords = () => {
    const records = sanitizeArray(recordsLoaded.records);
    if (!formTemplate) {
      return records;
    }
    return records.filter((r) => r.formTemplate === formTemplate);
  };

  const renderHeader = () => {
    const { filters, sort, onChange } = filterAndSort;
    return (
      <thead>
        <tr>
          <IfGranted expected={ROLE.READ_ALL_RECORDS} actual={currentUser.roles}>
            <th className="col-1 content-center">{i18n("records.id")}</th>
          </IfGranted>
          <th className="col-2 content-center">{i18n("records.local-name")}</th>
          <IfGranted expected={ROLE.READ_ALL_RECORDS} actual={currentUser.roles}>
            <FilterableInstitutionHeader filters={filters} onFilterChange={onChange} />
            <FilterableTemplateHeader filters={filters} onFilterChange={onChange} />
          </IfGranted>
          <FilterableLastModifiedHeader filters={filters} sort={sort} onFilterAndSortChange={onChange} />
          <FilterablePhaseHeader filters={filters} onFilterChange={onChange} />
          <th className="col-1 content-center">{i18n("actions")}</th>
        </tr>
      </thead>
    );
  };

  const renderRows = (filteredRecords) => {
    const formTemplateOptions = formTemplatesLoaded.formTemplates
      ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
      : [];

    return filteredRecords.map((record) => (
      <RecordRow
        key={record.key}
        record={record}
        onEdit={handlers.onEdit}
        onDelete={onDelete}
        formTemplateOptions={formTemplateOptions}
        currentUser={currentUser}
        disableDelete={disableDelete}
      />
    ));
  };

  const filteredRecords = getFormTemplateRecords();

  return (
    <div>
      <DeleteItemDialog
        onClose={onCancelDelete}
        onSubmit={onSubmitDelete}
        show={selectedRecord !== null}
        item={selectedRecord}
        itemLabel={getDeleteLabel()}
      />
      <Table size="sm" responsive striped bordered hover>
        {renderHeader()}
        <tbody>{renderRows(filteredRecords)}</tbody>
      </Table>
    </div>
  );
};

RecordTable.propTypes = {
  intl: PropTypes.shape({
    messages: PropTypes.object,
    formatMessage: PropTypes.func,
    locale: PropTypes.string,
  }),
  i18n: PropTypes.func,
  recordsLoaded: PropTypes.object.isRequired,
  formTemplate: PropTypes.string,
  formTemplatesLoaded: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  recordDeleted: PropTypes.object,
  disableDelete: PropTypes.bool,
  currentUser: PropTypes.object.isRequired,
  filterAndSort: PropTypes.object.isRequired,
};

RecordTable.defaultProps = {
  disableDelete: false,
};

const FilterableInstitutionHeader = ({ filters, onFilterChange }) => {
  const { i18n } = useI18n();
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose={true}
      overlay={
        <Popover id="records-filters-institution" className="record-filters-popup">
          <Popover.Body>
            <InstitutionFilter value={filters.institution} onChange={onFilterChange} />
          </Popover.Body>
        </Popover>
      }
    >
      <th
        id="records-institution"
        className="col-2 content-center cursor-pointer"
        title={i18n("table.column.filterable")}
      >
        {i18n("institution.panel-title")}
        <FilterIndicator filterValue={filters.institution} />
      </th>
    </OverlayTrigger>
  );
};

FilterableInstitutionHeader.propTypes = {
  filters: PropTypes.shape({
    institution: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    phase: PropTypes.string,
    formTemplate: PropTypes.string,
  }),
  onFilterChange: PropTypes.func,
};

const FilterableLastModifiedHeader = ({ filters, sort, onFilterAndSortChange }) => {
  const { i18n } = useI18n();
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose={true}
      overlay={
        <Popover id="records-filters-date" className="record-filters-popup">
          <Popover.Body>
            <DateIntervalFilter
              minDate={filters.minDate}
              maxDate={filters.maxDate}
              sort={sort.date}
              onChange={onFilterAndSortChange}
            />
          </Popover.Body>
        </Popover>
      }
    >
      <th
        id="records-lastmodified"
        className="col-2 content-center cursor-pointer"
        title={i18n("table.column.filterable")}
      >
        {i18n("records.last-modified")}
        <FilterIndicator filterValue={filters.minDate || filters.maxDate} />
        <SortIndicator direction={sort.date} />
      </th>
    </OverlayTrigger>
  );
};

FilterableLastModifiedHeader.propTypes = {
  filters: PropTypes.shape({
    institution: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    phase: PropTypes.string,
    formTemplate: PropTypes.string,
  }),
  sort: PropTypes.shape({
    date: PropTypes.string,
  }),
  onFilterAndSortChange: PropTypes.func,
};

const FilterablePhaseHeader = ({ filters, onFilterChange }) => {
  const { i18n } = useI18n();
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose={true}
      overlay={
        <Popover id="records-filters-phase" className="record-filters-popup">
          <Popover.Body>
            <PhaseFilter value={filters.phase} onChange={onFilterChange} />
          </Popover.Body>
        </Popover>
      }
    >
      <th id="records-phase" className="col-1 content-center cursor-pointer" title={i18n("table.column.filterable")}>
        {i18n("records.completion-status")}
        <FilterIndicator filterValue={filters.phase} />
      </th>
    </OverlayTrigger>
  );
};

FilterablePhaseHeader.propTypes = {
  filters: PropTypes.shape({
    institution: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    phase: PropTypes.string,
    formTemplate: PropTypes.string,
  }),
  onFilterChange: PropTypes.func,
};

const FilterableTemplateHeader = ({ filters, onFilterChange }) => {
  const { i18n } = useI18n();
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose={true}
      overlay={
        <Popover id="records-filters-template" className="record-filters-popup">
          <Popover.Body>
            <TemplateFilter value={filters.formTemplate} onChange={onFilterChange} />
          </Popover.Body>
        </Popover>
      }
    >
      <th id="records-template" className="col-2 content-center cursor-pointer" title={i18n("table.column.filterable")}>
        {i18n("records.form-template")}
        <FilterIndicator filterValue={filters.formTemplate} />
      </th>
    </OverlayTrigger>
  );
};

FilterableTemplateHeader.propTypes = {
  filters: PropTypes.shape({
    institution: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    phase: PropTypes.string,
    formTemplate: PropTypes.string,
  }),
  onFilterChange: PropTypes.func,
};

export default injectIntl(withI18n(RecordTable));
