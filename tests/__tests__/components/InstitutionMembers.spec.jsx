import { ACTION_STATUS, ROLE } from "../../../src/constants/DefaultConstants";
import React from "react";
import InstitutionMembers from "../../../src/components/institution/InstitutionMembers";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import * as RoleUtils from "../../../src/utils/RoleUtils.js";
import * as OidcUtils from "../../../src/utils/OidcUtils.js";
import { canWriteInstitution, canWriteUserInfo } from "../../../src/utils/RoleUtils.js";
import { isUsingOidcAuth } from "../../../src/utils/OidcUtils.js";

const defaultProps = {
  institutionMembers: {
    members: [
      { username: "john", firstName: "John", lastName: "Doe", emailAddress: "john@example.com" },
      { username: "jane", firstName: "Jane", lastName: "Smith", emailAddress: "jane@example.com" },
    ],
    status: ACTION_STATUS.SUCCESS,
  },
  institution: { key: "inst1" },
  onEditUser: vi.fn(),
  onAddNewUser: vi.fn(),
  onDelete: vi.fn(),
  currentUser: { username: "admin", roles: [ROLE.WRITE_ALL_USERS] },
  userDeleted: {},
};

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canWriteInstitution: vi.fn(),
  canWriteUserInfo: vi.fn(),
}));

vi.mock("../../../src/utils/OidcUtils.js", () => ({
  isUsingOidcAuth: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<InstitutionMembers {...defaultProps} {...props} />);
};

describe("InstitutionMembers", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    isUsingOidcAuth.mockReturnValue(true);
    canWriteUserInfo.mockReturnValue(true);
    canWriteInstitution.mockReturnValue(true);
  });

  it("renders empty state when no members exist", () => {
    renderComponent({ institutionMembers: { members: [], status: ACTION_STATUS.SUCCESS } });
    expect(screen.getByText(getMessageByKey("institution.members.not-found"))).toBeInTheDocument();
  });

  it("renders open button for all users", () => {
    renderComponent();
    expect(screen.getAllByText(getMessageByKey("open"))).toHaveLength(2);
  });

  it("renders delete button when current user has WriteUserInfo permissions", () => {
    renderComponent();
    expect(screen.getAllByText("Open")).toHaveLength(2);
    expect(screen.getAllByText("Delete")).toHaveLength(2);
  });

  it("does not render delete button when current user lacks WriteUserInfo permission", () => {
    canWriteUserInfo.mockReturnValue(false);
    renderComponent();
    expect(screen.getAllByText("Open")).toHaveLength(2);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("renders Add new user button in internal authorization and if current user has WriteInstitution permission", () => {
    isUsingOidcAuth.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByText(getMessageByKey("users.add-new-user"))).toBeInTheDocument();
  });

  it("triggers onAddNewUser when Add new user button is clicked", () => {
    isUsingOidcAuth.mockReturnValue(false);
    renderComponent();
    fireEvent.click(screen.getByText(getMessageByKey("users.add-new-user")));
    expect(defaultProps.onAddNewUser).toHaveBeenCalledWith(defaultProps.institution);
  });

  it("does not render Add new user button in Keycloak authorization", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("users.add-new-user"))).not.toBeInTheDocument();
  });
});
