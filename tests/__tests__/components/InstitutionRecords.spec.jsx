import InstitutionRecords from "../../../src/components/institution/InstitutionRecords.jsx";
import { describe, expect, it, vi } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const defaultProps = {
  recordsLoaded: {},
  formTemplatesLoaded: {},
  onEdit: vi.fn(),
  onExport: vi.fn(),
  currentUser: { username: "john" },
  filterAndSort: {
    sort: {},
    filters: {},
    onChange: vi.fn(),
  },
};

vi.mock("../../../src/components/record/RecordTable", () => ({
  default: () => <div data-testid="record-table">Record Table</div>,
}));

vi.mock("../../../src/components/record/ExportRecordsDropdown", () => ({
  default: ({ onExport }) => (
    <button data-testid="export-dropdown" onClick={onExport}>
      Export
    </button>
  ),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<InstitutionRecords {...defaultProps} {...props} />);
};

describe("InstitutionRecords", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct panel title", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("institution.records.panel-title"))).toBeInTheDocument();
  });

  it("renders the RecordTable component", () => {
    renderComponent();
    expect(screen.getByTestId("record-table")).toBeInTheDocument();
  });

  it("renders the ExportRecordsDropdown component", () => {
    renderComponent();
    expect(screen.getByTestId("export-dropdown")).toBeInTheDocument();
  });
});
