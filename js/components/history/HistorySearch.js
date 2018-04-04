import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {SEARCH_TYPE} from "../../constants/DefaultConstants";

let HistorySearch = (props) => (
    <div className="input-group history-search">
        <input className="form-control" type="text" onChange={props.handlers.handleChange}
               placeholder={props.i18n('history.search')}/>
        <div className="input-group-btn">
            <button type="button" className="btn btn-primary" disabled={!props.searchValue}
                    onClick={() => props.handlers.handleSearch(SEARCH_TYPE.ACTION, props.searchValue)}>{props.i18n('history.action')}</button>
            <button type="button" className="btn btn-primary" disabled={!props.searchValue}
                    onClick={() => props.handlers.handleSearch(SEARCH_TYPE.AUTHOR, props.searchValue)}>{props.i18n('history.author')}</button>
            <button type="button" className="btn btn-primary"
                    onClick={() => props.handlers.handleSearch(SEARCH_TYPE.RESET)}>{props.i18n('history.reset')}</button>
        </div>
    </div>
);

HistorySearch.propTypes = {
    handlers: React.PropTypes.object.isRequired,
    searchValue: React.PropTypes.string.isRequired
};

export default injectIntl(I18nWrapper(HistorySearch));

