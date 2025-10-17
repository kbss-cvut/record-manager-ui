import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ACTION_STATUS, RECORD_PHASE, ROLE } from "../../../src/constants/DefaultConstants";
import { describe, expect, vi, beforeEach, test } from "vitest";
import RecordTable from "../../../src/components/record/RecordTable.jsx";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import * as RecordState from "../../../src/model/RecordState.js";

const defaultProps = {
  recordsLoaded: {
    records: [
      {
        author: { firstName: "John", lastName: "Doe" },
        institution: { name: "testInstitution" },
        dateCreated: 1521225180115,
        key: "640579951330382351",
        localName: "test1",
        lastModified: 1521277544192,
        state: RecordState.createRecordState(),
        phase: RECORD_PHASE.OPEN,
        isNew: false,
      },
      {
        author: { firstName: "Tomas", lastName: "Shelby" },
        institution: { name: "testInstitution" },
        dateCreated: 1521225180115,
        key: "640579951330382354",
        localName: "test2",
        lastModified: 1521277544192,
        state: RecordState.createRecordState(),
        phase: RECORD_PHASE.OPEN,
        isNew: false,
      },
      {
        author: { firstName: "Arthur", lastName: "Shelby" },
        institution: { name: "testInstitution" },
        dateCreated: 1521225180115,
        key: "640579951330382358",
        localName: "test3",
        lastModified: 1521277544192,
        state: RecordState.createRecordState(),
        phase: RECORD_PHASE.OPEN,
        isNew: false,
      },
    ],
  },
  formTemplate: null,
  formTemplatesLoaded: {
    formTemplates: [
      { id: "template1", name: "Template 1" },
      { id: "template2", name: "Template 2" },
    ],
  },
  handlers: {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  },
  recordDeleted: { status: ACTION_STATUS.SUCCESS },
  disableDelete: false,
  currentUser: {
    username: "johndoe",
    roles: [],
  },
  filterAndSort: {
    filters: {},
    sort: {
      data: null,
    },
    onChange: vi.fn(),
  },
};

vi.mock("../../../src/components/record/RecordRow", () => ({
  default: ({ record, onDelete }) => (
    <tr data-testid={`record-row-${record.localName}`}>
      <td>{record.localName}</td>
      <td>
        <button data-testid={`delete-btn-${record.localName}`} onClick={() => onDelete(record)}>
          Delete
        </button>
      </td>
    </tr>
  ),
}));

vi.mock("../../../src/components/DeleteItemDialog", () => ({
  default: ({ show }) => (show ? <div data-testid="delete-item-dialog"></div> : null),
}));

vi.mock("react-bootstrap", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Table: ({ children }) => <table data-testid="record-table">{children}</table>,
  };
});

const renderComponent = (props) => {
  return renderWithIntl(<RecordTable {...defaultProps} {...props} />);
};

describe("RecordTable", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with all records", () => {
    renderComponent();
    expect(screen.getByTestId("record-table")).toBeInTheDocument();
    expect(screen.getByTestId("record-row-test1")).toBeInTheDocument();
    expect(screen.getByTestId("record-row-test2")).toBeInTheDocument();
    expect(screen.getByTestId("record-row-test3")).toBeInTheDocument();
  });

  it("renders id, institution, and form template header when user lacks READ_ALL_RECORDS role", () => {
    renderComponent({
      currentUser: {
        roles: [ROLE.READ_ALL_RECORDS],
      },
    });
    expect(screen.getByText(getMessageByKey("records.id"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("institution.panel-title"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("records.form-template"))).toBeInTheDocument();
  });

  it("does not render id, institution, and form template header when user lacks READ_ALL_RECORDS role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("records.id"))).not.toBeInTheDocument();
    expect(screen.queryByText(getMessageByKey("institution.panel-title"))).not.toBeInTheDocument();
    expect(screen.queryByText(getMessageByKey("records.form-template"))).not.toBeInTheDocument();
  });

  it("renders records", () => {
    renderComponent();
    expect(screen.getByTestId("record-row-test1")).toBeInTheDocument();
    expect(screen.getByTestId("record-row-test2")).toBeInTheDocument();
    expect(screen.getByTestId("record-row-test3")).toBeInTheDocument();
  });

  it("renders delete dialog when a record is selected for deletion", () => {
    renderComponent();

    const deleteButton = screen.getByTestId("delete-btn-test1");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-item-dialog")).toBeInTheDocument();
  });

  it("does not render delete dialog when a record is not selected for deletion", () => {
    renderComponent();
    expect(screen.getByTestId("delete-item-dialog")).toBeInTheDocument();
  });
});
