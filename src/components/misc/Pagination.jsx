import React from "react";
import PropTypes, { array } from "prop-types";
import { Pagination as BSPagination } from "react-bootstrap";
import { DEFAULT_PAGE_SIZE, STORAGE_TABLE_PAGE_SIZE_KEY } from "../../constants/DefaultConstants";
import Input from "../Input";
import { useI18n } from "../../hooks/useI18n";
import BrowserStorage from "../../utils/BrowserStorage";

/**
 * The first page.
 */
export const INITIAL_PAGE = 0;
export const MIN_PAGINATION_NUMBER = 5;

const PAGE_SIZES = [10, 20, 30, 50];
const INFINITE_PAGE_SIZE = Math.pow(2, 31) - 1;

const Pagination = ({ pageNumber, handlePagination, itemCount, pageCount, allowSizeChange }) => {
  const { i18n, formatMessage } = useI18n();
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  React.useEffect(() => {
    const storedPageSize = BrowserStorage.get(STORAGE_TABLE_PAGE_SIZE_KEY);
    if (storedPageSize) {
      setPageSize(Number(storedPageSize));
    }
  }, [setPageSize]);
  const onPageSizeSelect = (e) => {
    const value = Number(e.currentTarget.value);
    setPageSize(value);
    BrowserStorage.set(STORAGE_TABLE_PAGE_SIZE_KEY, value);
    handlePagination(INITIAL_PAGE);
  };

  const generatePageNumbers = () => {
    let range = Array.from({ length: pageCount }, (v, i) => i);

    if (pageCount < MIN_PAGINATION_NUMBER) {
      // show all pages, without ellipsis
      return range;
    }

    const pagesToShow = 4;
    const pageNumbers = [];
    let pageNumbersStart = pageNumber >= pageCount - pagesToShow ? pageCount - pagesToShow : pageNumber;
    let pageNumbersEnd = Math.min(pageNumber + pagesToShow, pageCount);

    pageNumbers.push(...range.slice(pageNumbersStart, pageNumbersEnd));

    const isLeftEllipsis = pageNumber > INITIAL_PAGE;
    const isRightEllipsis = pageNumber < pageCount / 2;

    if (isLeftEllipsis) {
      pageNumbers.splice(0, 0, "...");
    }
    if (isRightEllipsis) {
      pageNumbers.splice(pageNumbers.length - 1, 1, "...");
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <BSPagination>
          <BSPagination.First
            className="test-pag-arrow"
            disabled={pageNumber === INITIAL_PAGE}
            onClick={() => handlePagination(INITIAL_PAGE)}
          />
          <BSPagination.Prev
            className="test-pag-arrow"
            disabled={pageNumber === INITIAL_PAGE}
            onClick={() => handlePagination(pageNumber - 1)}
          />
          {generatePageNumbers().map((pageNum, i) => {
            if (pageNum === "...") {
              return <BSPagination.Ellipsis key={i} />;
            }
            return (
              <BSPagination.Item onClick={() => handlePagination(pageNum)} active={pageNum === pageNumber} key={i}>
                {pageNum + 1}
              </BSPagination.Item>
            );
          })}
          {pageCount !== undefined && (
            <BSPagination.Item active={pageNumber === pageCount} onClick={() => handlePagination(pageCount)}>
              {pageCount + 1}
            </BSPagination.Item>
          )}
          <BSPagination.Next
            className="test-pag-arrow"
            disabled={pageNumber >= pageCount}
            onClick={() => handlePagination(pageNumber + 1)}
          />
        </BSPagination>
      </div>
      {allowSizeChange && (
        <div className="d-flex justify-content-center">
          <Input type="select" value={pageSize} onChange={onPageSizeSelect}>
            {PAGE_SIZES.map((ps) => (
              <option key={ps} value={ps}>
                {formatMessage("table.pagination.size-message", { size: ps })}
              </option>
            ))}
            <option key="showall" value={INFINITE_PAGE_SIZE}>
              {i18n("table.pagination.size.all")}
            </option>
          </Input>
        </div>
      )}
    </>
  );
};

Pagination.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  handlePagination: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  pageCount: PropTypes.number,
  allowSizeChange: PropTypes.bool,
};

Pagination.defaultProps = {
  allowSizeChange: true,
};

export default Pagination;
