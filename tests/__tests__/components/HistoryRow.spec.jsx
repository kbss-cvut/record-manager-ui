import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HistoryRow from "../../../src/components/history/HistoryRow";
import { describe, expect, it, vi } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import { formatDateWithMilliseconds } from "../../../src/utils/Utils.js";

const defaultProps = {
  action: {
    key: "action123",
    type: "CREATE",
    author: { username: "John" },
    timestamp: 1526074842,
  },
  onOpen: vi.fn(),
};

const renderComponent = (props = {}) => {
  return renderWithIntl(<HistoryRow {...defaultProps} {...props} />);
};

describe("HistoryRow", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders action type, username, and timestamp correctly", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.action.type)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.action.author.username)).toBeInTheDocument();
    expect(screen.getByText(formatDateWithMilliseconds(defaultProps.action.timestamp))).toBeInTheDocument();
  });

  it("renders non-logged user when author is undefined", () => {
    renderComponent({
      ...defaultProps,
      action: {
        ...defaultProps.action,
        author: undefined,
      },
    });
    expect(screen.getByText(getMessageByKey("history.non-logged"))).toBeInTheDocument();
  });

  it("renders Open button with correct tooltip and text", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: getMessageByKey("open") });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", getMessageByKey("history.open-tooltip"));
  });

  it("calls onOpen with correct key when button is clicked", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: getMessageByKey("open") });
    fireEvent.click(button);
    expect(defaultProps.onOpen).toHaveBeenCalledWith(defaultProps.action.key);
    expect(defaultProps.onOpen).toHaveBeenCalledTimes(1);
  });
});
