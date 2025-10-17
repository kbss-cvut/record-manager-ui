import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { ACTION_STATUS, RECORD_PHASE } from "../../../src/constants/DefaultConstants";
import Record from "../../../src/components/record/Record";
import * as RecordState from "../../../src/model/RecordState";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as RoleUtils from "../../../src/utils/RoleUtils.js";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { useSelector } from "react-redux";

const defaultProps = {
  record: {
    author: { firstName: "John", lastName: "Doe" },
    institution: { name: "testInstitution" },
    dateCreated: 1521225180115,
    key: "640579951330382351",
    localName: "test",
    lastModified: 1521277544192,
    state: RecordState.createRecordState(),
    phase: RECORD_PHASE.OPEN,
    isNew: false,
  },
  handlers: {
    onSave: vi.fn(),
    onCancel: vi.fn(),
    onChange: vi.fn(),
    onEditUser: vi.fn(),
    onAddNewUser: vi.fn(),
    onDelete: vi.fn(),
  },
  formgen: {
    status: ACTION_STATUS.SUCCESS,
  },
  showAlert: false,
  recordLoaded: {
    status: ACTION_STATUS.SUCCESS,
    error: "",
  },
  recordSaved: {
    status: ACTION_STATUS.SUCCESS,
    error: "",
  },
  newRecord: {
    localName: "",
    complete: false,
    isNew: true,
    state: RecordState.createInitialState(),
  },
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

vi.mock("react-bootstrap", () => ({
  Alert: ({ children, variant }) => (
    <div data-testid="alert" data-variant={variant}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, disabled, variant, size, className }) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../../src/components/Loader", () => ({
  LoaderCard: ({ header }) => <div data-testid="loader-card">{header}</div>,
  LoaderSmall: () => <div data-testid="loader-small" />,
}));

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canReadInstitution: vi.fn(),
  canWriteRecord: vi.fn(),
  hasRole: vi.fn(),
}));

vi.mock("../../../src/components/record/TypeaheadAnswer.jsx", () => ({
  default: () => ({}),
}));

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(() => vi.fn()),
  useSelector: vi.fn(),
}));

vi.mock("../../../src/actions/FormTemplatesActions.js", () => ({
  loadFormTemplates: vi.fn(),
}));

vi.mock("../../../src/components//HorizontalInput.jsx", () => ({
  default: ({ label, value }) => (
    <div data-testid="horizontal-input">
      <label>{label}</label>
      <input value={value} readOnly />
    </div>
  ),
}));

vi.mock("../../../src/components/record/RecordProvenance.jsx", () => ({
  default: ({ record }) => <div data-testid="record-provenance">{record?.localName}</div>,
}));

vi.mock("../../../src/components/record/RequiredAttributes.jsx", () => ({
  default: ({ record }) => <div data-testid="required-attributes">{record?.localName}</div>,
}));

vi.mock("../../../src/components/FormValidationDialog.jsx", () => ({
  default: ({ show, handleOnCloseModal }) =>
    show && (
      <div data-testid="validation-dialog">
        <button onClick={handleOnCloseModal}>Close</button>
      </div>
    ),
}));

vi.mock("../../../src/components/button/RejectButton.jsx", () => ({
  default: ({ onClick, children, disabled }) => (
    <button data-testid="reject-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("../../../src/components/record/RecordForm.jsx", () => ({
  default: (props) => {
    return (
      <div data-testid="record-form">
        <button>Validate</button>
        <button>Get Data</button>
        {props.isFormValid && <span data-testid="form-valid">Valid</span>}
      </div>
    );
  },
}));

const renderComponent = (props) => {
  return renderWithIntl(<Record {...defaultProps} {...props} />);
};

describe("Record", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    RoleUtils.canWriteRecord.mockReturnValue(true);
    RoleUtils.hasRole.mockReturnValue(true);
    RoleUtils.canReadInstitution.mockReturnValue(true);
    useSelector.mockReturnValue([{ name: "default", description: "Default form template", attributes: [] }]);
  });

  it("renders loader if no record", () => {
    renderComponent({
      record: null,
    });
    expect(screen.getByTestId("loader-card")).toBeInTheDocument();
  });

  it("renders warning alert when no form templates", () => {
    useSelector.mockReturnValue([]);
    renderComponent();
    expect(screen.getByTestId("alert")).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("formTemplates.no-form-templates"))).toBeInTheDocument();
  });

  it("does not render warning alert when form templates not empty", () => {
    renderComponent();
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(getMessageByKey("formTemplates.no-form-templates"))).not.toBeInTheDocument();
  });

  it("renders institution if current user has ReadInstitution permission", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("record.institution"))).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultProps.record.institution.name)).toBeInTheDocument();
  });

  it("does not render institution if current user lacks ReadInstitution permission", () => {
    RoleUtils.canReadInstitution.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByText(getMessageByKey("record.institution"))).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(defaultProps.record.institution.name)).not.toBeInTheDocument();
  });

  it("renders reject button if user has writeRecords permission, record is not new, and has rejectRecords role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("reject"))).toBeInTheDocument();
  });

  it("renders complete button if user has writeRecords permission, rejectRecords role, and record is not new", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("complete"))).toBeInTheDocument();
  });

  it("renders save button if user has writeRecords permission", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("save"))).toBeInTheDocument();
  });

  it("does not render save button if lacks writeRecords permission", () => {
    RoleUtils.canWriteRecord.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByText(getMessageByKey("save"))).not.toBeInTheDocument();
  });
});
