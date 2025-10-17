import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import UserRow from "../../../src/components/user/UserRow.jsx";
import { isUsingOidcAuth } from "../../../src/utils/OidcUtils.js";
import { renderWithIntl } from "../../utils/utils.jsx";

vi.mock("../../../src/utils/OidcUtils", () => ({
  isUsingOidcAuth: vi.fn(() => false),
}));

const mockUser = {
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
};

describe("UserRow", () => {
  const renderComponent = (user = mockUser, overrides = {}) => {
    return renderWithIntl(<UserRow user={user} onEdit={vi.fn()} onDelete={vi.fn()} {...overrides} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user full name as a link button with correct tooltip", () => {
    const { getByRole } = renderComponent();
    const fullName = `${mockUser.firstName} ${mockUser.lastName}`;
    const nameButton = getByRole("button", { name: new RegExp(fullName, "i") });
    expect(nameButton).toBeInTheDocument();
    expect(nameButton).toHaveAttribute("title", "View and edit details of this user");
  });

  it("renders username correctly", () => {
    renderComponent();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it("renders institution name when present", () => {
    renderComponent();
    expect(screen.getByText(mockUser.institution.name)).toBeInTheDocument();
  });

  it("renders email address correctly", () => {
    renderComponent();
    expect(screen.getByText(mockUser.emailAddress)).toBeInTheDocument();
  });

  it("renders Open button with correct text and tooltip", () => {
    const { getByRole } = renderComponent();
    const openButton = getByRole("button", { name: /Open/i });
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveAttribute("title", "View and edit details of this user");
  });

  it("renders Delete button with correct text and tooltip when not using OIDC", () => {
    const { getByRole } = renderComponent();
    const deleteButton = getByRole("button", { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute("title", "Delete this user");
  });

  it("calls onEdit when name link button is clicked", () => {
    const onEdit = vi.fn();
    const fullName = `${mockUser.firstName} ${mockUser.lastName}`;
    const { getByRole } = renderComponent(mockUser, { onEdit });
    const nameButton = getByRole("button", { name: new RegExp(fullName, "i") });
    fireEvent.click(nameButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it("calls onEdit when Open button is clicked", () => {
    const onEdit = vi.fn();
    const { getByRole } = renderComponent(mockUser, { onEdit });
    const openButton = getByRole("button", { name: /Open/i });
    fireEvent.click(openButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it("calls onDelete when Delete button is clicked", () => {
    const onDelete = vi.fn();
    const { getByRole } = renderComponent(mockUser, { onDelete });
    const deleteButton = getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockUser);
  });

  it("does not render institution name when user has no institution", () => {
    const userWithoutInstitution = { ...mockUser, institution: undefined };
    renderComponent(userWithoutInstitution);
    expect(screen.queryByText(mockUser.institution.name)).not.toBeInTheDocument();
  });

  it("hides Delete button when using OIDC auth", () => {
    vi.mocked(isUsingOidcAuth).mockReturnValue(true);
    renderComponent();
    expect(screen.queryByRole("button", { name: /Delete/i })).not.toBeInTheDocument();
  });
});
