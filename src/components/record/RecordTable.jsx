import React from "react";
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

class RecordTable extends React.Component {
  static propTypes = {
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

  static defaultProps = {
    disableDelete: false,
  };

  constructor(props) {
    super(props);
    this.i18n = this.props.i18n;
    this.state = {
      showDialog: false,
    };
  }

  _onDelete = (record) => {
    this.setState({ selectedRecord: record });
  };

  _onCancelDelete = () => {
    this.setState({ selectedRecord: null });
  };

  _onSubmitDelete = () => {
    this.props.handlers.onDelete(this.state.selectedRecord);
    this.setState({ selectedRecord: null });
  };

  render() {
    const filteredRecords = this._getFormTemplateRecords();
    return (
      <div>
        <DeleteItemDialog
          onClose={this._onCancelDelete}
          onSubmit={this._onSubmitDelete}
          show={this.state.selectedRecord !== null}
          item={this.state.selectedRecord}
          itemLabel={this._getDeleteLabel()}
        />
        <Table size="sm" responsive striped bordered hover>
          {this._renderHeader()}
          <tbody>{this._renderRows(filteredRecords)}</tbody>
        </Table>
      </div>
    );
  }

  _getDeleteLabel() {
    return this.state.selectedRecord ? this.state.selectedRecord.localName : "";
  }

  _renderHeader() {
    const { filters, sort, onChange } = this.props.filterAndSort;
    return (
      <thead>
        <tr>
          <IfGranted expected={ROLE.ADMIN} actual={this.props.currentUser.role}>
            <th className="col-1 content-center">{this.i18n("records.id")}</th>
          </IfGranted>
          <th className="col-2 content-center">{this.i18n("records.local-name")}</th>
          <IfGranted expected={ROLE.ADMIN} actual={this.props.currentUser.role}>
            <FilterableInstitutionHeader filters={filters} onFilterChange={onChange} />
            <FilterableTemplateHeader filters={filters} onFilterChange={onChange} />
          </IfGranted>
          <FilterableLastModifiedHeader filters={filters} sort={sort} onFilterAndSortChange={onChange} />
          <FilterablePhaseHeader filters={filters} onFilterChange={onChange} />
          <th className="col-1 content-center">{this.i18n("actions")}</th>
        </tr>
      </thead>
    );
  }

  _renderRows(filteredRecords) {
    const { formTemplatesLoaded, handlers, intl } = this.props;
    const formTemplateOptions = formTemplatesLoaded.formTemplates
      ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
      : [];
    let rows = [];
    for (let i = 0, len = filteredRecords.length; i < len; i++) {
      rows.push(
        <RecordRow
          key={filteredRecords[i].key}
          record={filteredRecords[i]}
          onEdit={handlers.onEdit}
          onDelete={this._onDelete}
          formTemplateOptions={formTemplateOptions}
          currentUser={this.props.currentUser}
          disableDelete={this.props.disableDelete}
        />,
      );
    }
    return rows;
  }

  _getFormTemplateRecords() {
    const records = sanitizeArray(this.props.recordsLoaded.records),
      formTemplate = this.props.formTemplate;

    if (!formTemplate) {
      return records;
    }
    return records.filter((r) => r.formTemplate === formTemplate);
  }
}

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
