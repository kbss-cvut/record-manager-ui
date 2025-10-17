"use strict";

import React from "react";

import { screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTable from "../../../src/components/user/UserTable";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "../../utils/utils.jsx";

describe("UserTable", function () {
  const handlers = {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
  };

  const users = [
    {
      uri: "http://onto.fel.cvut.cz/ontologies/record-manager/erter-tert",
      firstName: "Test2",
      lastName: "Man",
      username: "testman2",
      emailAddress: "test@man.io",
      types: ["http://onto.fel.cvut.cz/ontologies/record-manager/doctor"],
    },
  ];
  const renderComponent = (usersList = users, overrides = {}) => {
    return renderWithIntl(<UserTable users={usersList} handlers={handlers} {...overrides} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state message when no users", () => {
    renderComponent([]);
    expect(screen.getByText(/No users/i)).toBeInTheDocument();
    expect(screen.queryByRole("rowgroup")).not.toBeInTheDocument();
  });
});
