import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "../../utils/utils.jsx";
import BrowserStorage from "../../../src/utils/BrowserStorage.js";
import Pagination, { INITIAL_PAGE } from "../../../src/components/misc/Pagination.jsx";

const defaultProps = {
  pageNumber: 0,
  handlePagination: vi.fn(),
  itemCount: 100,
  pageCount: 10,
  allowSizeChange: true,
};

vi.mock("../../../src/utils/BrowserStorage.js", () => {
  return {
    default: {
      get: vi.fn(),
      set: vi.fn(),
    },
  };
});

vi.mock("react-bootstrap", () => {
  const Pagination = ({ children }) => <div>{children}</div>;
  Pagination.First = ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="first-btn">
      {children}
    </button>
  );
  Pagination.Prev = ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="prev-btn">
      {children}
    </button>
  );
  Pagination.Item = ({ children, onClick, active }) => (
    <button onClick={onClick} className={active ? "active" : ""} data-testid={`page-${children}`}>
      {children}
    </button>
  );
  Pagination.Ellipsis = () => <span data-testid="ellipsis">...</span>;
  Pagination.Next = ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="next-btn">
      {children}
    </button>
  );
  return { Pagination };
});

vi.mock("../../../src/components/Input");

const renderComponent = (props) => {
  return renderWithIntl(<Pagination {...defaultProps} {...props} />);
};

describe("Pagination", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    BrowserStorage.get.mockReturnValue(null);
    BrowserStorage.set.mockReturnValue(undefined);
  });

  it("renders pagination controls", () => {
    renderComponent({ pageCount: 5 });
    expect(screen.getByTestId("first-btn")).toBeInTheDocument();
    expect(screen.getByTestId("prev-btn")).toBeInTheDocument();
    expect(screen.getByTestId("next-btn")).toBeInTheDocument();
  });

  it("disables First and Prev buttons on first page", () => {
    renderComponent({ pageNumber: INITIAL_PAGE, pageCount: 5 });
    expect(screen.getByTestId("first-btn")).toBeDisabled();
    expect(screen.getByTestId("prev-btn")).toBeDisabled();
  });

  it("enables Next button when not on last page", () => {
    renderComponent({ pageNumber: 0, pageCount: 5 });
    expect(screen.getByTestId("next-btn")).not.toBeDisabled();
  });

  it("disables Next button on last page", () => {
    renderComponent({ pageNumber: 4, pageCount: 5 });
    expect(screen.getByTestId("next-btn")).toBeDisabled();
  });

  it("calls handlePagination with INITIAL_PAGE (0) on First button click", () => {
    renderComponent({ pageNumber: 2, pageCount: 5 });
    fireEvent.click(screen.getByTestId("first-btn"));
    expect(defaultProps.handlePagination).toHaveBeenCalledWith(INITIAL_PAGE);
  });

  it("calls handlePagination with previous page on Prev button click", () => {
    renderComponent({ pageNumber: 2, pageCount: 5 });
    fireEvent.click(screen.getByTestId("prev-btn"));
    expect(defaultProps.handlePagination).toHaveBeenCalledWith(1);
  });

  it("calls handlePagination with next page on Next button click", () => {
    renderComponent({ pageNumber: 2, pageCount: 5 });
    fireEvent.click(screen.getByTestId("next-btn"));
    expect(defaultProps.handlePagination).toHaveBeenCalledWith(3);
  });

  it("calls handlePagination with correct page number on page item click", () => {
    renderComponent({ pageNumber: 0, pageCount: 3 });
    const page1Button = screen.getByTestId("page-1");
    fireEvent.click(page1Button);
    expect(defaultProps.handlePagination).toHaveBeenCalledWith(0);
  });

  it("marks current page as active", () => {
    renderComponent({ pageNumber: 2, pageCount: 5 });
    expect(screen.getByTestId("page-3")).toHaveClass("active");
  });
});
