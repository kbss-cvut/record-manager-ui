import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import Institutions from "../../../src/components/institution/Institutions.jsx";
import { canCreateInstitution } from "../../../src/utils/RoleUtils.js";

const defaultProps = {
  institutionsLoaded: {
    status: ACTION_STATUS.SUCCESS,
    institutions: [
      {
        uri: "http://test1.io",
        key: "823372507340798303",
        name: "Test1 Institution",
        emailAddress: "test1@institution.io",
      },
      {
        uri: "http://test2.io",
        key: "823372507340798301",
        name: "Test2 Institution",
        emailAddress: "test2@institution.io",
      },
    ],
  },
  handlers: {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
  },
  institutionDeleted: {
    status: ACTION_STATUS.SUCCESS,
  },
};

vi.mock("../../../src/components/Loader", () => {
  return {
    LoaderSmall: () => <div data-testid="loader">Loading...</div>,
  };
});

vi.mock("../../../src/components/institution/InstitutionTable", () => ({
  default: ({ institutions }) => (
    <div data-testid="institution-table">
      {institutions.map((inst) => (
        <div key={inst.key}>{inst.name}</div>
      ))}
    </div>
  ),
}));

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canCreateInstitution: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<Institutions {...defaultProps} {...props} />);
};

describe("Institutions", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    canCreateInstitution.mockReturnValue(true);
  });

  it("renders the correct panel title", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("institutions.panel-title"))).toBeInTheDocument();
  });

  it("renders Loader when institutions are loading", () => {
    renderComponent({ institutionsLoaded: { status: ACTION_STATUS.PENDING, institutions: [] } });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders InstitutionTable with institutions", () => {
    renderComponent();
    expect(screen.getByTestId("institution-table")).toBeInTheDocument();
    expect(screen.getByText("Test1 Institution")).toBeInTheDocument();
    expect(screen.getByText("Test2 Institution")).toBeInTheDocument();
  });

  it("renders create institution button when current user has createInstitution permission", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("institutions.create-institution"))).toBeInTheDocument();
  });

  it("does not render create institution button when current user lacks createInstitution permission", () => {
    canCreateInstitution.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByText(getMessageByKey("institutions.create-institution"))).not.toBeInTheDocument();
  });
});
