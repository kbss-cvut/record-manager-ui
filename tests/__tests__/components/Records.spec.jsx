import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Records from "../../../src/components/record/Records";
import { ACTION_STATUS, ROLE, SortDirection } from "../../../src/constants/DefaultConstants";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";

const defaultProps = {
  recordsLoaded: {
    status: ACTION_STATUS.SUCCESS,
    records: [
      {
        uri: "http://onto.fel.cvut.cz/ontologies/record-manager/patient-record#instance456619209",
        key: "159968282553298774",
        localName: "Test1",
        dateCreated: "1520956570034",
        author: { username: "test" },
        institution: { key: 12345678 },
      },
      {
        uri: "http://onto.fel.cvut.cz/ontologies/record-manager/patient-record#instance456619208",
        key: "159968282553298775",
        localName: "Test2",
        dateCreated: "1520956570035",
        author: { username: "test" },
        institution: { key: 12345678 },
      },
    ],
  },
  pagination: {
    pageNumber: 0,
    handlePagination: vi.fn(),
    itemCount: 2,
    pageCount: 1,
  },
  filterAndSort: {
    sort: {
      date: SortDirection.DESC,
    },
    filters: {},
    onChange: vi.fn(),
  },
  recordDeleted: {
    status: ACTION_STATUS.SUCCESS,
  },
  handlers: {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
    onExport: vi.fn(),
  },
  currentUser: { username: "tomas_shelby", roles: [] },
  formTemplatesLoaded: {
    formTemplates: [
      {
        name: "default",
        description: "Default form template",
        attributes: [],
      },
    ],
  },
};

vi.mock("../../../src/components/misc/Pagination.jsx", () => ({
  default: () => <div data-testid="pagination">Pagination Component</div>,
}));

vi.mock("../../../src/components/record/RecordTable", () => ({
  default: () => <div data-testid="record-table">Record Table Component</div>,
}));

vi.mock("react-bootstrap", async (importOriginal) => {
  const actual = await importOriginal();

  const Card = ({ children }) => <div data-testid="card">{children}</div>;
  Card.Header = ({ children }) => <div data-testid="card-header">{children}</div>;
  Card.Body = ({ children }) => <div data-testid="card-body">{children}</div>;

  return {
    ...actual,
    Card,
    Alert: () => <div data-testid="alert">{getMessageByKey("records.no-records")}</div>,
    Button: ({ children, onClick, disabled }) => (
      <button data-testid="button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
  };
});

vi.mock("../../../src/components/record/ExportRecordsDropdown", () => ({
  default: () => <div data-testid="export-dropdown">Export Dropdown Component</div>,
}));

const renderComponent = (props) => {
  return renderWithIntl(<Records {...defaultProps} {...props} />);
};

describe("Records", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with records", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("records.panel-title"))).toBeInTheDocument();
    expect(screen.getByTestId("record-table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("renders no records alert when records array is empty", () => {
    renderComponent({ recordsLoaded: { records: [] } });
    expect(screen.getByTestId("alert")).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("records.no-records"))).toBeInTheDocument();
  });

  it("renders create button", () => {
    renderComponent();
    const createButton = screen.getByText(getMessageByKey("records.create-tile"));
    expect(createButton).toBeInTheDocument();
    expect(createButton).not.toBeDisabled();
  });

  it("renders import button", () => {
    renderComponent();
    const importButton = screen.getByText(getMessageByKey("records.import"));
    expect(importButton).toBeInTheDocument();
    expect(importButton).not.toBeDisabled();
  });

  it("renders export dropdown", () => {
    renderComponent();
    expect(screen.getByTestId("export-dropdown")).toBeInTheDocument();
  });

  it("renders publish button when current user has Publish role", () => {
    renderComponent({ currentUser: { roles: [ROLE.PUBLISH_RECORDS] } });
    const publishButton = screen.getByText(getMessageByKey("publish"));
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).not.toBeDisabled();
  });

  it("does not render publish button when current user lacks Publish role", () => {
    const publishButton = screen.queryByText(getMessageByKey("publish"));
    expect(publishButton).not.toBeInTheDocument();
  });
});
