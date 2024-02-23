import React from "react";
import PropTypes from "prop-types";
import {Pagination as BSPagination} from "react-bootstrap";
import {DEFAULT_PAGE_SIZE, STORAGE_TABLE_PAGE_SIZE_KEY} from "../../constants/DefaultConstants";
import Input from "../Input";
import {useI18n} from "../../hooks/useI18n";
import BrowserStorage from "../../utils/BrowserStorage";

/**
 * The first page.
 */
export const INITIAL_PAGE = 0;

const PAGE_SIZES = [10, 20, 30, 50];
const INFINITE_PAGE_SIZE = Math.pow(2, 31) - 1;

const Pagination = ({pageNumber, handlePagination, itemCount, pageCount, allowSizeChange}) => {
    const {i18n, formatMessage} = useI18n();
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

    return <>
        <div className="d-flex justify-content-center">
            <BSPagination>
                <BSPagination.First disabled={pageNumber === INITIAL_PAGE} onClick={() => handlePagination(INITIAL_PAGE)}/>
                <BSPagination.Prev disabled={pageNumber === INITIAL_PAGE} onClick={() => handlePagination(pageNumber - 1)}/>
                <BSPagination.Item active={true}>{pageNumber + 1}</BSPagination.Item>
                <BSPagination.Next disabled={itemCount < pageSize} onClick={() => handlePagination(pageNumber + 1)}/>
                {pageCount !== undefined &&
                    <BSPagination.Last disabled={pageNumber === pageCount}
                                       onClick={() => handlePagination(pageCount)}/>}
            </BSPagination>
        </div>
        {allowSizeChange && <div className="d-flex justify-content-center">
            <Input type="select" value={pageSize} onChange={onPageSizeSelect}>
                {PAGE_SIZES.map(ps => <option key={ps}
                                              value={ps}>{formatMessage("table.pagination.size-message", {size: ps})}</option>)}
                <option key="showall" value={INFINITE_PAGE_SIZE}>{i18n("table.pagination.size.all")}</option>
            </Input>
        </div>}
    </>
}

Pagination.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    handlePagination: PropTypes.func.isRequired,
    itemCount: PropTypes.number.isRequired,
    pageCount: PropTypes.number,
    allowSizeChange: PropTypes.bool
};

Pagination.defaultProps = {
    allowSizeChange: true
}

export default Pagination;

