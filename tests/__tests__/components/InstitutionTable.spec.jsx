import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import InstitutionTable from "../../../src/components/institution/InstitutionTable.jsx";
import { fireEvent } from "@testing-library/react";
import { canWriteInstitution } from "../../../src/utils/RoleUtils.js";

const defaultProps = {
  institutionDeleted: {
    status: ACTION_STATUS.SUCCESS,
  },
  handlers: {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
  },
  institutions: [
    {
      uri: "http://test.io",
      key: "823372507340798303",
      name: "Test Institution",
      emailAddress: "test@institution.io",
    },
  ],
};

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canWriteInstitution: vi.fn(),
  canReadInstitution: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<InstitutionTable {...defaultProps} {...props} />);
};

describe("InstitutionTable", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    canWriteInstitution.mockReturnValue(true);
  });

  it("renders DeleteItemDialog when current user clicks delete button", () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", { name: getMessageByKey("delete") });
    fireEvent.click(deleteButton);
    expect(screen.getByText(getMessageByKey("delete.dialog-title"))).toBeInTheDocument();
  });

  it("renders not found message when institutions list is empty", () => {
    renderComponent({ institutions: [] });
    expect(screen.getByText(getMessageByKey("institutions.not-found"))).toBeInTheDocument();
  });

  it("renders institutions table when institutions are provided", () => {
    renderComponent();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Test Institution")).toBeInTheDocument();
  });
});
