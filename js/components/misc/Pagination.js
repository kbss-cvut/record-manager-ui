import React from "react";
import PropTypes from "prop-types";
import {Pagination as BSPagination} from "react-bootstrap";
import {PAGE_SIZE} from "../../constants/DefaultConstants";

/**
 * The first page.
 */
export const INITIAL_PAGE = 0;

let Pagination = ({pageNumber, handlePagination, itemCount, pageCount}) => {
    return <div className="d-flex justify-content-center">
        <BSPagination>
            <BSPagination.First disabled={pageNumber === 0} onClick={() => handlePagination(0)}/>
            <BSPagination.Prev disabled={pageNumber === 0} onClick={() => handlePagination(pageNumber - 1)}/>
            <BSPagination.Item active={true}>{pageNumber + 1}</BSPagination.Item>
            <BSPagination.Next disabled={itemCount < PAGE_SIZE} onClick={() => handlePagination(pageNumber + 1)}/>
            {pageCount &&
                <BSPagination.Last disabled={pageNumber === pageCount} onClick={() => handlePagination(pageCount)}/>}
        </BSPagination>
    </div>
}

Pagination.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    handlePagination: PropTypes.func.isRequired,
    itemCount: PropTypes.number.isRequired,
    pageCount: PropTypes.number
};

export default Pagination;

