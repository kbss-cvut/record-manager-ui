import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Button} from "react-bootstrap";

let HistorySearch = (props) => (
    <tr>
        <td className='report-row'>
            <input className="form-control" name="action" type="text" value={props.searchData.action || ""} onChange={props.handlers.handleChange}/>
        </td>
        <td className='report-row'>
            <input className="form-control" name="author" type="text" value={props.searchData.author || ""} onChange={props.handlers.handleChange}/>
        </td>
        <td className='report-row'>
            <input className="form-control" type="text" disabled={true}/>
        </td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small' title={props.i18n('history.search')}
                    onClick={() => props.handlers.handleSearch(1)}>{props.i18n('history.search')}</Button>
            <Button bsStyle='warning' bsSize='small' title={props.i18n('history.reset')}
                    onClick={() => props.handlers.handleReset()}>{props.i18n('history.reset')}</Button>
        </td>
    </tr>);

HistorySearch.propTypes = {
    handlers: React.PropTypes.object.isRequired,
    searchData: React.PropTypes.object.isRequired
};

export default injectIntl(I18nWrapper(HistorySearch));

