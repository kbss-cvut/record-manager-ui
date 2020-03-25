import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {ACTIONS_PER_PAGE, PAGINATION_DIRECTION, SEARCH_TYPE} from "../../constants/DefaultConstants";
import PropTypes from "prop-types";

let HistoryPagination = (props) => (
    <nav className="content-center">
        <ul className="pagination">
            <li className={`page-item ${props.pageNumber === 1 && "disabled"}`}>
                        <span className="page-link pointer" onClick={() => props.handlePagination(PAGINATION_DIRECTION.PREVIOUS)}>
                            {props.i18n('history.previous')}</span>
            </li>
            <li className="page-item disabled"><span className="page-link">{props.pageNumber}</span></li>
            <li className={`page-item ${props.numberOfActions <= ACTIONS_PER_PAGE && "disabled"}`}>
                        <span className="page-link pointer" onClick={() => props.handlePagination(PAGINATION_DIRECTION.NEXT)}>
                            {props.i18n('history.next')}</span>
            </li>
        </ul>
    </nav>
);

HistoryPagination.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    handlePagination: PropTypes.func.isRequired,
    numberOfActions: PropTypes.number.isRequired
};

export default injectIntl(I18nWrapper(HistoryPagination));

