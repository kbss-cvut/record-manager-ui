import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../../../src/components/dashboard/Dashboard";
import { vi, describe, expect } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { ROLE } from "../../../src/constants/DefaultConstants.js";

const defaultProps = {
  currentUser: {
    firstName: "John",
  },
  handlers: {
    showUsers: vi.fn(),
    showInstitutions: vi.fn(),
    showRecords: vi.fn(),
    createRecord: vi.fn(),
    showMyInstitution: vi.fn(),
    showMyProfile: vi.fn(),
    showStatistics: vi.fn(),
  },
  formTemplatesLoaded: {
    formTemplates: null,
  },
};

const renderComponent = (props = {}) => {
  return renderWithIntl(<Dashboard {...defaultProps} {...props} />);
};

describe("Dashboard", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create record tile when current user has WRITE_ALL_RECORDS role", () => {
    renderComponent({ currentUser: { roles: [ROLE.WRITE_ALL_RECORDS] } });
    expect(screen.getByText(getMessageByKey("dashboard.create-tile"))).toBeInTheDocument();
  });

  it("does not render create record tile when current user lacks WRITE_ALL_RECORDS role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("dashboard.create-tile"))).not.toBeInTheDocument();
  });

  it("calls createRecord handler when create tile is clicked", () => {
    renderComponent({ currentUser: { roles: [ROLE.WRITE_ALL_RECORDS] } });
    fireEvent.click(screen.getByText(getMessageByKey("dashboard.create-tile")));
    expect(defaultProps.handlers.createRecord).toHaveBeenCalled();
  });

  it("always renders import records tile", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("records.import.dialog.title"))).toBeInTheDocument();
  });

  it("opens import dialog when import tile is clicked", async () => {
    renderComponent();
    const importTile = screen.getByText(getMessageByKey("records.import.dialog.title"));
    fireEvent.click(importTile);
    await waitFor(() => {
      expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    });
  });

  it("renders users tile when current user has READ_ALL_USERS role", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_USERS] } });
    expect(screen.getByText(getMessageByKey("dashboard.users-tile"))).toBeInTheDocument();
  });

  it("does not render users tile when current user lacks READ_ALL_USERS role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("dashboard.users-tile"))).not.toBeInTheDocument();
  });

  it("calls showUsers handler when users tile is clicked", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_USERS] } });
    fireEvent.click(screen.getByText(getMessageByKey("dashboard.users-tile")));
    expect(defaultProps.handlers.showUsers).toHaveBeenCalled();
  });

  it("renders institutions tile when current user has READ_ALL_ORGANIZATIONS role", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_ORGANIZATIONS] } });
    expect(screen.getByText(getMessageByKey("dashboard.institutions-tile"))).toBeInTheDocument();
  });

  it("does not render institutions tile when user lacks READ_ALL_ORGANIZATIONS role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("dashboard.institutions-tile"))).not.toBeInTheDocument();
  });

  it("calls showInstitutions handler when institutions tile is clicked", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_ORGANIZATIONS] } });
    fireEvent.click(screen.getByText(getMessageByKey("dashboard.institutions-tile")));
    expect(defaultProps.handlers.showInstitutions).toHaveBeenCalled();
  });

  it("renders statistics tile when user has READ_STATISTICS role", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_STATISTICS] } });
    expect(screen.getByText(getMessageByKey("dashboard.statistics-tile"))).toBeInTheDocument();
  });

  it("does not render statistics tile when user lacks READ_STATISTICS role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("dashboard.statistics-tile"))).not.toBeInTheDocument();
  });

  it("calls showStatistics handler when statistics tile is clicked", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_STATISTICS] } });
    fireEvent.click(screen.getByText(getMessageByKey("dashboard.statistics-tile")));
    expect(defaultProps.handlers.showStatistics).toHaveBeenCalled();
  });

  it("renders generic records tile when user has READ_ALL_RECORDS role", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_RECORDS] } });
    expect(screen.getByText(getMessageByKey("dashboard.records-tile"))).toBeInTheDocument();
  });

  it("does not render generic records tile when user lacks READ_ALL_RECORDS role", () => {
    renderComponent();
    expect(screen.queryByText(getMessageByKey("dashboard.records-tile"))).not.toBeInTheDocument();
  });

  it("calls showRecords without template id when generic records tile is clicked", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_RECORDS] } });
    fireEvent.click(screen.getByText(getMessageByKey("dashboard.records-tile")));
    expect(defaultProps.handlers.showRecords).toHaveBeenCalledWith();
  });
});
