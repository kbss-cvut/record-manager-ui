import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import HistoryTable from "../../../src/components/history/HistoryTable.jsx";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";

const defaultProps = {
  actions: [
    {
      key: "1",
      type: "CREATE",
    },
    {
      key: "2",
      type: "UPDATE",
    },
  ],
  searchData: {},
  handlers: {
    handleSearch: vi.fn(),
    handleReset: vi.fn(),
    handleChange: vi.fn(),
    onKeyPress: vi.fn(),
    onOpen: vi.fn(),
  },
};

vi.mock("../../../src/components/history/HistoryRow.jsx", () => ({
  default: () => <div data-testid="history-row"></div>,
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<HistoryTable {...defaultProps} {...props} />);
};

describe("HistoryTable", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table headers with text", () => {
    renderComponent();
    expect(screen.getByText(getMessageByKey("history.action-type"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("history.author"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("history.time"))).toBeInTheDocument();
    expect(screen.getByText(getMessageByKey("actions"))).toBeInTheDocument();
  });

  it("renders not found message when actions array is empty", () => {
    renderComponent({ actions: [] });
    expect(screen.getByText(getMessageByKey("history.not-found"))).toBeInTheDocument();
  });

  it("renders History rows when actions array is not empty", () => {
    renderComponent();
    expect(screen.getAllByTestId("history-row")).toHaveLength(2);
  });
});
