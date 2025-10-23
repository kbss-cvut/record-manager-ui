import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import User from "../../../src/components/user/User";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { isUsingOidcAuth } from "../../../src/utils/OidcUtils.js";
import { canImpersonate, canWriteUserInfo, hasSupersetOfPrivileges } from "../../../src/utils/RoleUtils.js";
import UserValidator from "../../../src/validation/UserValidator.jsx";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants.js";

const defaultProps = {
  user: { username: "tomas_shelby", isNew: false },
  currentUser: { username: "admin_user" },
  institutions: [
    { uri: "inst1", name: "Institution 1" },
    { uri: "inst2", name: "Institution 2" },
  ],
  roleGroups: [],
  handlers: {
    oncancel: vi.fn(),
    generateUsername: vi.fn(),
    onSave: vi.fn(),
    impersonate: vi.fn(),
  },
  userSaved: {
    status: ACTION_STATUS.SUCCESS,
    error: "",
  },
  impersonation: {
    status: ACTION_STATUS.SUCCESS,
    error: "",
  },
};

vi.mock("../../../src/validation/UserValidator.jsx", () => ({
  default: {
    isValid: vi.fn(),
  },
}));

vi.mock("../../../src/utils/RoleUtils", () => ({
  canWriteUserInfo: vi.fn(),
  getRoles: vi.fn(),
  hasRole: vi.fn(),
  hasSupersetOfPrivileges: vi.fn(),
  canImpersonate: vi.fn(),
}));

vi.mock("../../../src/components/Loader", () => ({
  LoaderCard: ({ header }) => <div data-testid="loader-card">{header}</div>,
  LoaderSmall: () => <span data-testid="loader-small">Loading...</span>,
}));

vi.mock("../../../src/utils/OidcUtils", () => ({
  isUsingOidcAuth: vi.fn(),
}));

vi.mock("../../../src/components/RoleBadges.jsx", () => ({
  default: () => <div data-testid="role-badges"></div>,
}));

vi.mock("../../../src/components/RoleGroupsSelector.jsx", () => ({
  default: () => <div data-testid="role-groups-selector"></div>,
}));

vi.mock("../../../src/components/institution/InstitutionSelector.jsx", () => ({
  default: () => <div data-testid="institution-selector"></div>,
}));

const renderComponent = (props) => {
  return renderWithIntl(<User {...defaultProps} {...props} />);
};
describe("User", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    isUsingOidcAuth.mockReturnValue(true);
    canWriteUserInfo.mockReturnValue(true);
    hasSupersetOfPrivileges.mockReturnValue(true);
    UserValidator.isValid.mockReturnValue(true);
    canImpersonate.mockReturnValue(true);
  });

  it("should render loading state when user is not provided", () => {
    renderComponent({
      user: null,
    });
    expect(screen.getByTestId("loader-card")).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    renderComponent({});
    expect(screen.getByTestId("input-firstName")).toBeInTheDocument();
    expect(screen.getByTestId("input-lastName")).toBeInTheDocument();
    expect(screen.getByTestId("input-username")).toBeInTheDocument();
    expect(screen.getByTestId("input-emailAddress")).toBeInTheDocument();
  });

  it("always renders institution selector", () => {
    renderComponent();
    expect(screen.getByTestId("institution-selector")).toBeInTheDocument();
  });

  it("renders role groups selector only in Internal Authorization", () => {
    isUsingOidcAuth.mockReturnValue(false);
    renderComponent();
    expect(screen.getByTestId("role-groups-selector")).toBeInTheDocument();
  });

  it("does not render role groups selector when using OIDC Authorization", () => {
    renderComponent();
    expect(screen.queryByTestId("role-groups-selector")).not.toBeInTheDocument();
  });

  it("renders role badges only in Internal Authorization", () => {
    isUsingOidcAuth.mockReturnValue(false);
    renderComponent();
    expect(screen.getByTestId("role-badges")).toBeInTheDocument();
  });

  it("does not render role badges when using OIDC Authorization", () => {
    renderComponent();
    expect(screen.queryByTestId("role-badges")).not.toBeInTheDocument();
  });

  it("renders save and saveAndSendEmail buttons when currentUser has WriteUserInfo permission", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("save"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("save-and-send-email"))).toBeInTheDocument();
  });

  it("enables save and saveAndSendEmail buttons when user form is valid and user is not pending", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("save"))).toBeEnabled();
    expect(screen.getByText(getMessageByKey("save-and-send-email"))).toBeEnabled();
  });

  it("disables save and saveAndSendEmail buttons when user form is invalid", () => {
    UserValidator.isValid.mockReturnValue(false);
    renderComponent();
    expect(screen.getByText(getMessageByKey("save"))).toBeDisabled();
    expect(screen.getByText(getMessageByKey("save-and-send-email"))).toBeDisabled();
  });

  it("disables save and saveAndSendEmail buttons when user is pending", () => {
    renderComponent({
      userSaved: {
        status: ACTION_STATUS.PENDING,
      },
    });
    expect(screen.getByText(getMessageByKey("save"))).toBeDisabled();
    expect(screen.getByText(getMessageByKey("save-and-send-email"))).toBeDisabled();
  });

  it("renders impersonate button when currentUser has canImpersonate permission", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("user.impersonate"))).toBeInTheDocument();
  });

  it("does not render impersonate button when currentUser lacks canImpersonate permission", () => {
    canImpersonate.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByText(getMessageByKey("user.impersonate"))).not.toBeInTheDocument();
  });
});
