import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import RecordRow from "../../../src/components/record/RecordRow.jsx";
import { COLUMNS, RECORD_PHASE as RecordPhase, ROLE } from "../../../src/constants/DefaultConstants.js";
import { admin } from "../../__mocks__/users.js";
import { formatDate } from "../../../src/utils/Utils.js";

const defaultProps = {
  disableDelete: false,
  deletionLoading: false,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  record: {
    uri: "http://onto.fel.cvut.cz/ontologies/record-manager/record#instance456619208",
    key: "159968282553298775",
    localName: "Test",
    dateCreated: 1520956570035,
    author: { username: "Thomas", firstName: "Thomas", lastName: "Shelby" },
    institution: { key: 12345678, name: "Test institution" },
    lastModified: 1730034000000,
    formTemplate: "Template1",
    phase: RecordPhase.OPEN,
  },
  currentUser: admin,
  visibleColumns: Object.values(COLUMNS),
  formTemplateOptions: [
    {
      id: "Template1",
      name: "Template 1",
    },
  ],
};

vi.mock("react-authorization", () => {
  return {
    IfGranted: ({ expected, actual, children }) =>
      expected === ROLE.READ_ALL_RECORDS && actual.includes(ROLE.READ_ALL_RECORDS) ? children : null,
  };
});

const renderComponent = (props) => {
  return renderWithIntl(<RecordRow {...defaultProps} {...props} />);
};

describe("RecordRow", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table row structure", () => {
    renderComponent();
    const row = screen.getByRole("row");
    expect(row).toHaveClass("position-relative");
  });

  it("renders key if it is visible", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.record.key)).toBeInTheDocument();
  });

  it("does not render key if it is not visible", () => {
    renderComponent({ visibleColumns: Object.values(COLUMNS).filter((col) => col !== COLUMNS.ID) });
    expect(screen.queryByText(defaultProps.record.key)).not.toBeInTheDocument();
  });

  it("renders localName if it is visible", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.record.localName)).toBeInTheDocument();
  });

  it("does not render localName if it is not visible", () => {
    renderComponent({ visibleColumns: Object.values(COLUMNS).filter((col) => col !== COLUMNS.NAME) });
    expect(screen.queryByText(defaultProps.record.localName)).not.toBeInTheDocument();
  });

  it("renders author if it is visible and has firstName and lastName", () => {
    renderComponent();
    expect(screen.getByText("Thomas Shelby")).toBeInTheDocument();
  });

  it("does not render author if it is not visible", () => {
    renderComponent({ visibleColumns: Object.values(COLUMNS).filter((col) => col !== COLUMNS.AUTHOR) });
    expect(screen.queryByText("Thomas Shelby")).not.toBeInTheDocument();
  });

  it("renders 'Not Found' for author if firstName or lastName are missing", () => {
    renderComponent({ record: { ...defaultProps.record, author: { username: "Thomas" } } });
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });

  it("renders institution if it is visible", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.record.institution.name)).toBeInTheDocument();
  });

  it("does not render institution if it is not visible", () => {
    renderComponent({ visibleColumns: Object.values(COLUMNS).filter((col) => col !== COLUMNS.INSTITUTION) });
    expect(screen.queryByText(defaultProps.record.institution.name)).not.toBeInTheDocument();
  });

  it("renders form template if it is visible", () => {
    renderComponent();
    expect(screen.queryByText("Template 1")).toBeInTheDocument();
  });

  it("does not render form template if it is not visible", () => {
    renderComponent({ visibleColumns: Object.values(COLUMNS).filter((col) => col !== COLUMNS.TEMPLATE) });
    expect(screen.queryByText("Template 1")).not.toBeInTheDocument();
  });

  it("renders last modified date if it is visible", () => {
    renderComponent();
    expect(screen.getByText(formatDate(new Date(defaultProps.record.lastModified)))).toBeInTheDocument();
  });

  it("does not render last modified date if it is not visible", () => {
    renderComponent({ visibleColumns: Object.values(COLUMNS).filter((col) => col !== COLUMNS.LAST_MODIFIED) });
    expect(screen.queryByText("27-10-24 14:00")).not.toBeInTheDocument();
  });

  it("renders delete button when delete is not disabled", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("delete"))).toBeInTheDocument();
  });

  it("does not render delete button when delete is disabled", () => {
    renderComponent({ disableDelete: true });
    expect(screen.queryByText(getMessageByKey("delete"))).not.toBeInTheDocument();
  });

  it("renders open button", () => {
    renderComponent({ currentUser: { roles: [] } });
    expect(screen.getByText(getMessageByKey("open"))).toBeInTheDocument();
  });
});
