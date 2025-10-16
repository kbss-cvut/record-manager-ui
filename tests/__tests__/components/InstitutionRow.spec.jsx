import { describe, expect, it, vi } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import InstitutionRow from "../../../src/components/institution/InstitutionRow.jsx";
import { canReadInstitution, canWriteInstitution } from "../../../src/utils/RoleUtils.js";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const defaultProps = {
  institution: {
    uri: "http://test.io",
    key: "823372507340798303",
    name: "Test Institution",
    emailAddress: "test@institution.io",
  },
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  deletionLoading: false,
};

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canReadInstitution: vi.fn(),
  canWriteInstitution: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<InstitutionRow {...defaultProps} {...props} />);
};

describe("InstitutionRow", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    canReadInstitution.mockReturnValue(true);
    canWriteInstitution.mockReturnValue(true);
  });

  it("renders the institution name as a link button", () => {
    renderComponent();
    const nameButton = screen.getByRole("button", { name: defaultProps.institution.name });
    expect(nameButton).toBeInTheDocument();
  });

  it("renders the institution email address", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.institution.emailAddress)).toBeInTheDocument();
  });

  it("renders open button when current user has ReadInstitution permission", () => {
    renderComponent();
    const openButton = screen.getByRole("button", { name: getMessageByKey("open") });
    expect(openButton).toBeInTheDocument();
  });

  it("does not render open button when current user lacks ReadInstitution permission", () => {
    renderComponent();
    canReadInstitution.mockReturnValue(false);
    const openButton = screen.getByRole("button", { name: getMessageByKey("open") });
    expect(openButton).toBeInTheDocument();
  });

  it("renders delete button when current user has WriteInstitution permission", () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", { name: getMessageByKey("delete") });
    expect(deleteButton).toBeInTheDocument();
  });

  it("does not render delete button when current user lacks WriteInstitution permission", () => {
    renderComponent();
    canWriteInstitution.mockReturnValue(false);
    const deleteButton = screen.getByRole("button", { name: getMessageByKey("delete") });
    expect(deleteButton).toBeInTheDocument();
  });
});
