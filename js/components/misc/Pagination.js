import React from "react";
import {PAGE_SIZE} from "../../constants/DefaultConstants";
import PropTypes from "prop-types";
import {FaAngleDoubleLeft, FaAngleLeft, FaAngleRight} from "react-icons/fa";

export const INITIAL_PAGE = 0;

let Pagination = ({pageNumber, handlePagination, itemCount}) => {
    return <nav className="d-flex justify-content-center">
        <ul className="pagination">
            <li className={`page-item ${pageNumber === 0 && "disabled"}`}>
                        <span className="page-link pointer"
                              onClick={() => handlePagination(0)}>
                            <FaAngleDoubleLeft/>
                            </span>
            </li>
            <li className={`page-item ${pageNumber === 0 && "disabled"}`}>
                        <span className="page-link pointer"
                              onClick={() => handlePagination(pageNumber - 1)}>
                            <FaAngleLeft/>
                            </span>
            </li>
            <li className="page-item disabled"><span className="page-link">{pageNumber + 1}</span></li>
            <li className={`page-item ${itemCount < PAGE_SIZE && "disabled"}`}>
                        <span className="page-link pointer"
                              onClick={() => handlePagination(pageNumber + 1)}>
                        <FaAngleRight/>
                        </span>
            </li>
        </ul>
    </nav>
}

Pagination.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    handlePagination: PropTypes.func.isRequired,
    itemCount: PropTypes.number.isRequired
};

export default Pagination;

