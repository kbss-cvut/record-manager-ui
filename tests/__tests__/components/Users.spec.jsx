import React from "react";
import Users from "../../../src/components/user/Users";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithIntl } from "../../utils/utils.jsx";
import { screen, fireEvent } from "@testing-library/react";
import { isUsingOidcAuth } from "../../../src/utils/OidcUtils.js";
import "@testing-library/jest-dom";

vi.mock("../../../src/utils/OidcUtils", () => ({
  isUsingOidcAuth: vi.fn(() => false),
}));

const users = [
  {
    username: "testman1",
  },
  {
    username: "testman2",
  },
];

const handlers = {
  onEdit: vi.fn(),
  onCreate: vi.fn(),
  onDelete: vi.fn(),
};

const usersLoaded = {
  status: ACTION_STATUS.SUCCESS,
  users,
};

const usersLoadedEmpty = {
  status: ACTION_STATUS.SUCCESS,
  users: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Users", function () {
  const renderComponent = (usersLoaded = users, handlersList = handlers, overrides = {}) => {
    return renderWithIntl(<Users usersLoaded={usersLoaded} handlers={handlersList} {...overrides} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a 'Create user' button when Internal Authorization configured", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /Create user/i });
    fireEvent.click(button);

    expect(handlers.onCreate).toHaveBeenCalledTimes(1);
  });

  it("hides `Create user` button when using OIDC auth", () => {
    vi.mocked(isUsingOidcAuth).mockReturnValue(true);
    renderComponent();
    expect(screen.queryByRole("button", { name: /Create user/i })).not.toBeInTheDocument();
  });
});
