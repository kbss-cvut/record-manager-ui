import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe } from "vitest";
import HistorySearch from "../../../src/components/history/HistorySearch.jsx";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";

const defaultProps = {
  handlers: {
    handleChange: vi.fn(),
    onKeyPress: vi.fn(),
    handleSearch: vi.fn(),
    handleReset: vi.fn(),
  },
  searchData: {
    action: "",
    author: "",
  },
};

const renderComponent = (props = {}) => {
  return renderWithIntl(
    <table>
      <tbody>
        <HistorySearch {...defaultProps} {...props} />
      </tbody>
    </table>,
  );
};
describe("HistorySearch", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders action input correctly", () => {
    renderComponent();
    const actionInput = screen.getByTestId("action-input");
    expect(actionInput).toBeInTheDocument();
    expect(actionInput).toHaveValue("");
  });

  it("renders author input correctly", () => {
    renderComponent();
    const authorInput = screen.getByTestId("author-input");
    expect(authorInput).toBeInTheDocument();
    expect(authorInput).toHaveValue("");
  });

  it("renders disabled time input correctly", () => {
    renderComponent();
    const disabledInput = screen.getByTestId("time-input");
    expect(disabledInput).toBeInTheDocument();
    expect(disabledInput).toBeDisabled();
  });

  it("renders search and reset buttons with correct text and calls them", () => {
    renderComponent();
    const searchButton = screen.getByRole("button", { name: getMessageByKey("history.search") });
    const resetButton = screen.getByRole("button", { name: getMessageByKey("history.reset") });
    fireEvent.click(searchButton);
    fireEvent.click(resetButton);
    expect(defaultProps.handlers.handleSearch).toHaveBeenCalledTimes(1);
    expect(defaultProps.handlers.handleReset).toHaveBeenCalledTimes(1);
  });
});
