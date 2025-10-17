import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import UserRow from "../../../src/components/user/UserRow.jsx";
import { isUsingOidcAuth } from "../../../src/utils/OidcUtils.js";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { canWriteUserInfo } from "../../../src/utils/RoleUtils.js";

const defaultProps = {
  user: {
    uri: "http://onto.fel.cvut.cz/ontologies/record-manager/Admin-Administratorowitch",
    firstName: "Test1",
    lastName: "Man",
    username: "testman1",
    emailAddress: "test@man.io",
    institution: {
      uri: "http://test.io",
      key: "823372507340798303",
      name: "Test Institution",
      emailAddress: "test@institution.io",
    },
    types: [
      "http://onto.fel.cvut.cz/ontologies/record-manager/administrator",
      "http://onto.fel.cvut.cz/ontologies/record-manager/doctor",
    ],
  },
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

vi.mock("../../../src/utils/OidcUtils", () => ({
  isUsingOidcAuth: vi.fn(() => false),
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../../src/utils/RoleUtils", () => ({
  canWriteUserInfo: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<UserRow {...defaultProps} {...props} />);
};

describe("UserRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    canWriteUserInfo.mockReturnValue(true);
  });

  it("renders user full name as a link button with correct tooltip", () => {
    renderComponent();
    const fullName = `${defaultProps.user.firstName} ${defaultProps.user.lastName}`;
    const nameButton = screen.getByRole("button", { name: fullName });
    expect(nameButton).toBeInTheDocument();
    expect(nameButton).toHaveAttribute("title", getMessageByKey("users.open-tooltip"));
  });

  it("renders username correctly", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.user.username)).toBeInTheDocument();
  });

  it("renders institution name when present", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.user.institution.name)).toBeInTheDocument();
  });

  it("renders email address correctly", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.user.emailAddress)).toBeInTheDocument();
  });

  it("renders Open button with correct text and tooltip", () => {
    renderComponent();
    const openButton = screen.getByRole("button", { name: getMessageByKey("open") });
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveAttribute("title", "View and edit details of this user");
  });

  it("renders Delete button with correct text and tooltip when not using OIDC", () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute("title", "Delete this user");
  });

  it("calls onEdit when name link button is clicked", () => {
    const fullName = `${defaultProps.user.firstName} ${defaultProps.user.lastName}`;
    renderComponent();
    const nameButton = screen.getByRole("button", { name: fullName });
    fireEvent.click(nameButton);
    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.user);
  });

  it("calls onEdit when Open button is clicked", () => {
    renderComponent();
    const openButton = screen.getByRole("button", { name: getMessageByKey("open") });
    fireEvent.click(openButton);
    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.user);
  });

  it("calls onDelete when Delete button is clicked", () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", { name: getMessageByKey("delete") });
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.user);
  });

  it("does not render institution name when user has no institution", () => {
    renderComponent({
      user: {
        institution: null,
      },
    });
    expect(screen.queryByText(defaultProps.user.institution.name)).not.toBeInTheDocument();
  });

  it("does not render Delete button when using OIDC auth", () => {
    isUsingOidcAuth.mockReturnValue(true);
    renderComponent();
    expect(screen.queryByRole("button", { name: getMessageByKey("delete") })).not.toBeInTheDocument();
  });
});
