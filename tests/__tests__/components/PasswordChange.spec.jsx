import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import PasswordChange from "../../../src/components/user/PasswordChange";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import UserValidator from "../../../src/validation/UserValidator.jsx";
import { canWriteUserInfo } from "../../../src/utils/RoleUtils.js";

const defaultProps = {
  handlers: {
    onSave: vi.fn(),
    onCancel: vi.fn(),
    onChange: vi.fn(),
  },
  valid: true,
  currentUser: {
    username: "johndoe",
  },
  match: {
    params: {
      username: "johndoe",
    },
  },
  password: {
    currentPassword: "current",
    newPassword: "new",
    confirmPassword: "new",
  },
  passwordChange: {},
};

vi.mock("../../../src/validation/UserValidator.jsx", () => ({
  default: {
    isPasswordValid: vi.fn(),
  },
}));

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canWriteUserInfo: vi.fn(),
}));

vi.mock("../../../src/components/HelpIcon.jsx", () => ({
  default: () => <div data-testid="help-icon">HelpIcon</div>,
}));

vi.mock("../../../src/components/AlertMessage.jsx", () => ({
  default: ({ children }) => <div data-testid="alert-message">{children}</div>,
}));

vi.mock("../HorizontalInput", () => ({ type, name, label, value, onChange, labelWidth, inputWidth }) => (
  <div data-testid={`input-${name}`}>
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} />
  </div>
));

const renderComponent = (props = {}) => {
  return renderWithIntl(<PasswordChange {...defaultProps} {...props} />);
};

describe("PasswordChange", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    UserValidator.isPasswordValid.mockReturnValue(true);
    canWriteUserInfo.mockReturnValue(true);
  });

  it("renders all input fields when current user edits himself", () => {
    renderComponent();
    expect(screen.getByText(`${getMessageByKey("user.password-current")}*`)).toBeInTheDocument();
    expect(screen.getByText(`${getMessageByKey("user.password-new")}*`)).toBeInTheDocument();
    expect(screen.getByText(`${getMessageByKey("user.password-confirm")}*`)).toBeInTheDocument();
  });

  it("does not render current password input when current user edits other user", () => {
    renderComponent({ match: { params: { username: "janedoe" } } });
    expect(screen.queryByText(`${getMessageByKey("user.password-current")}*`)).not.toBeInTheDocument();
    expect(screen.getByText(`${getMessageByKey("user.password-new")}*`)).toBeInTheDocument();
    expect(screen.getByText(`${getMessageByKey("user.password-confirm")}*`)).toBeInTheDocument();
  });

  it("disables buttons when password is invalid", () => {
    UserValidator.isPasswordValid.mockReturnValue(false);
    renderComponent();

    const saveButton = screen.getByText(getMessageByKey("save"));
    const saveEmailButton = screen.getByText(getMessageByKey("save-and-send-email"));

    expect(saveButton).toBeDisabled();
    expect(saveEmailButton).toBeDisabled();
  });

  it("renders alert message when password is invalid", () => {
    renderComponent({
      valid: false,
    });
    expect(screen.getByTestId("alert-message")).toBeInTheDocument();
  });

  it("does not render alert message when password is valid", () => {
    renderComponent({
      valid: true,
    });
    expect(screen.queryByTestId("alert-message")).not.toBeInTheDocument();
  });

  it("renders save buttons when current user has WriteUserInfo permission", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("save-and-send-email"))).toBeInTheDocument();
    expect(screen.queryByText(getMessageByKey("save"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("cancel"))).toBeInTheDocument();
  });

  it("does not render save buttons when current user lacks WriteUserInfo permission", () => {
    canWriteUserInfo.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByText(getMessageByKey("save-and-send-email"))).not.toBeInTheDocument();
    expect(screen.queryByText(getMessageByKey("save"))).not.toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("cancel"))).toBeInTheDocument();
  });
});
