import { screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTable from "../../../src/components/user/UserTable";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { admin, entryClerk } from "../../__mocks__/users.js";

const defaultProps = {
  handlers: {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
  },
  users: [admin, entryClerk],
};

vi.mock("../../../src/components/DeleteItemDialog", () => ({
  default: ({ onClose, onSubmit, show, itemLabel }) => {
    if (!show) return null;
    return (
      <div role="dialog">
        Delete {itemLabel}?<button onClick={onClose}>Cancel Delete</button>
        <button onClick={onSubmit}>Confirm Delete</button>
      </div>
    );
  },
}));

vi.mock("../../../src/components/user/UserRow", () => ({
  default: ({ user, onEdit, onDelete }) => (
    <tr>
      <td>
        {user.firstName} {user.lastName}
      </td>
      <td>{user.username}</td>
      <td>{user.institution ? user.institution.name : ""}</td>
      <td>{user.email}</td>
      <td>
        <button onClick={() => onEdit(user)}>Edit</button>
        <button onClick={() => onDelete(user)}>Delete</button>
      </td>
    </tr>
  ),
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<UserTable {...defaultProps} {...props} />);
};

describe("UserTable", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders No users were found message when no users provided", () => {
    renderComponent({
      users: [],
    });
    expect(screen.getByText(getMessageByKey("users.not-found"))).toBeInTheDocument();
    expect(screen.queryByRole("rowgroup")).not.toBeInTheDocument();
  });

  it("renders table with users", () => {
    renderComponent();

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(defaultProps.users.length + 1); // +1 for header row
    expect(screen.queryByText(getMessageByKey("users.not-found"))).not.toBeInTheDocument();

    expect(screen.getByText(getMessageByKey("name"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("login.username"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("institution.name"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("users.email"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("actions"))).toBeInTheDocument();
  });

  it("opens delete dialog when delete button is clicked", () => {
    renderComponent();
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes delete dialog when cancel is clicked", () => {
    renderComponent();

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel Delete" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
