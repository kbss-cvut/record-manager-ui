import Users from "../../../src/components/user/Users";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { screen, fireEvent } from "@testing-library/react";
import { isUsingOidcAuth } from "../../../src/utils/OidcUtils.js";
import "@testing-library/jest-dom";
import React from "react";

vi.mock("../../../src/utils/OidcUtils", () => ({
  isUsingOidcAuth: vi.fn(() => false),
}));

vi.mock("../../../src/components/user/UserTable", () => ({
  default: () => <div data-testid="record-table">Users Table</div>,
}));

const defaultProps = {
  handlers: {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
  },
  usersLoaded: {
    status: ACTION_STATUS.SUCCESS,
    users: [
      {
        username: "batman",
      },
      {
        username: "joker",
      },
    ],
  },
  usersLoadedEmpty: {
    status: ACTION_STATUS.SUCCESS,
    users: [],
  },
};

const renderComponent = (props) => {
  return renderWithIntl(<Users {...defaultProps} {...props} />);
};

describe("Users", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title with users table", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("users.panel-title"))).toBeInTheDocument();
    expect(screen.getByTestId("record-table")).toBeInTheDocument();
  });

  it("renders a 'Create user' button when Internal Authorization configured", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: getMessageByKey("users.create-user") });
    fireEvent.click(button);
    expect(defaultProps.handlers.onCreate).toHaveBeenCalledTimes(1);
  });

  it("does not render `Create user` button when using OIDC auth", () => {
    isUsingOidcAuth.mockReturnValue(true);
    renderComponent();
    expect(screen.queryByRole("button", { name: getMessageByKey("users.create-user") })).not.toBeInTheDocument();
  });
});
