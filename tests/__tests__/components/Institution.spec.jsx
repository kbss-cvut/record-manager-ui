import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ACTION_STATUS, SortDirection } from "../../../src/constants/DefaultConstants";
import Institution from "../../../src/components/institution/Institution";
import { describe, expect, it, vi, beforeEach } from "vitest";
import InstitutionValidator from "../../../src/validation/InstitutionValidator.jsx";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import {
  canReadInstitutionRecords,
  canReadInstitutionUsers,
  canWriteInstitution,
} from "../../../src/utils/RoleUtils.js";

const defaultProps = {
  institution: {
    key: "1",
    name: "Test Institution",
    emailAddress: "test@inst.com",
    isNew: false,
  },
  institutionLoaded: {},
  institutionSaved: { status: ACTION_STATUS.SUCCESS },
  institutionMembers: {},
  recordsLoaded: {
    status: ACTION_STATUS.SUCCESS,
    records: [],
  },
  formTemplatesLoaded: {},
  handlers: {
    onChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
    onEditRecord: vi.fn(),
    onExportRecords: vi.fn(),
    onDelete: vi.fn(),
    onEditUser: vi.fn(),
    onAddNewUser: vi.fn(),
  },
  currentUser: { username: "John" },
  filterAndSort: {
    sort: { date: SortDirection.DESC },
    filters: {},
    onChange: vi.fn(),
  },
  userDeleted: {},
};

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canWriteInstitution: vi.fn(),
  canReadInstitutionUsers: vi.fn(),
  canReadInstitutionRecords: vi.fn(),
}));

vi.mock("../../../src/validation/InstitutionValidator.jsx", () => {
  return {
    default: {
      isValid: vi.fn(() => true),
    },
  };
});

vi.mock("../../../src/components/institution/InstitutionMembers", () => ({
  default: () => <div data-testid="institution-members">Members</div>,
}));

vi.mock("../../../src/components/institution/InstitutionRecords", () => ({
  default: () => <div data-testid="institution-records">Records</div>,
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<Institution {...defaultProps} {...props} />);
};

describe("Institution", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    canWriteInstitution.mockReturnValue(true);
    canReadInstitutionUsers.mockReturnValue(true);
    canReadInstitutionRecords.mockReturnValue(true);
    InstitutionValidator.isValid.mockReturnValue(true);
  });

  it("renders institution details correctly", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("institution.panel-title"))).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-emailAddress")).toBeInTheDocument();

    const nameInput = screen.getByTestId("input-name").querySelector("input");
    const emailInput = screen.getByTestId("input-emailAddress").querySelector("input");

    expect(nameInput).toHaveValue(defaultProps.institution.name);
    expect(emailInput).toHaveValue(defaultProps.institution.emailAddress);
  });

  it("disables inputs when current current user lacks WriteInstitution permission", async () => {
    canWriteInstitution.mockReturnValue(false);
    renderComponent();

    const nameInput = screen.getByTestId("input-name").querySelector("input");
    const emailInput = screen.getByTestId("input-emailAddress").querySelector("input");

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });

  it("renders save button for current current user with WriteInstitution permission", () => {
    renderComponent();
    const saveButton = screen.getByText(getMessageByKey("save"));
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it("disables save button when institution is invalid", () => {
    InstitutionValidator.isValid.mockReturnValue(false);
    renderComponent();
    expect(screen.getByText(getMessageByKey("save"))).toBeDisabled();
  });

  it("renders InstitutionRecords when current user has ReadInstitutionRecords permission", () => {
    renderComponent();
    expect(screen.getByTestId("institution-records")).toBeInTheDocument();
  });

  it("does not render InstitutionRecords when current user lacks read permission", () => {
    canReadInstitutionRecords.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByTestId("institution-records")).not.toBeInTheDocument();
  });

  it("renders InstitutionMembers when current user has ReadInstitutionUsers permission", () => {
    renderComponent();
    expect(screen.getByTestId("institution-members")).toBeInTheDocument();
  });

  it("does not render InstitutionMember when current user lacks ReadInstitutionUsers permission", () => {
    canReadInstitutionUsers.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByTestId("institution-members")).not.toBeInTheDocument();
  });

  it("calls onSave handler when save button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText(getMessageByKey("save")));
    expect(defaultProps.handlers.onSave).toHaveBeenCalled();
  });

  it("calls onCancel handler when cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText(getMessageByKey("cancel")));
    expect(defaultProps.handlers.onCancel).toHaveBeenCalled();
  });
});
