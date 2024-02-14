import React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";

let HistorySearch = (props) => (
    <tr>
        <td className='report-row'>
            <input className="form-control" name="action" type="text" value={props.searchData.action || ""}
                   onChange={props.handlers.handleChange} onKeyPress={props.handlers.onKeyPress}/>
        </td>
        <td className='report-row'>
            <input className="form-control" name="author" type="text" value={props.searchData.author || ""}
                   onChange={props.handlers.handleChange} onKeyPress={props.handlers.onKeyPress}/>
        </td>
        <td className='report-row'>
            <input className="form-control" type="text" disabled={true}/>
        </td>
        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={props.i18n('history.search')}
                    onClick={() => props.handlers.handleSearch(1)}>{props.i18n('history.search')}</Button>
            <Button variant='warning' size='sm' title={props.i18n('history.reset')}
                    onClick={() => props.handlers.handleReset()}>{props.i18n('history.reset')}</Button>
        </td>
    </tr>);

HistorySearch.propTypes = {
    handlers: PropTypes.object.isRequired,
    searchData: PropTypes.object.isRequired
};

export default injectIntl(withI18n(HistorySearch));

