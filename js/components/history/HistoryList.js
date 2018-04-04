'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Panel} from "react-bootstrap";
import {loadActions} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {
    ACTION_STATUS, ALERT_TYPES, ACTIONS_PER_PAGE,
    PAGINATION_DIRECTION, SEARCH_TYPE
} from "../../constants/DefaultConstants";
import {LoaderPanel} from "../Loader";
import AlertMessage from "../AlertMessage";
import HistoryTable from "./HistoryTable";
import {Routes} from "../../utils/Routes";
import {transitionToWithOpts} from "../../utils/Routing";

class ActionsHistory extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            searchValue: '',
            lastSearchedValue: '',
            hasSearched: false,
            pageNumber: 1,
            searchType: SEARCH_TYPE.ALL
        }
    }

    componentDidMount() {
        this.props.loadActions(1);
    }

    _onOpen = (key) => {
        this.props.transitionToWithOpts(Routes.historyAction, {
            params: {key}
        });
    };

    _handleChange = (e) => {
        this.setState({searchValue: e.target.value});
    };

    _handlePagination = (direction) => {
        if (this.props.actionsLoaded.actions.length <= ACTIONS_PER_PAGE && direction === 1 ||
            this.state.pageNumber === 1 && direction === -1) {
            return;
        }
        const newPageNumber = this.state.pageNumber + direction;
        this.setState({pageNumber: newPageNumber});
        switch(this.state.searchType){
            case SEARCH_TYPE.ALL:
                this._onAllSearch(newPageNumber);
                break;
            case SEARCH_TYPE.AUTHOR:
                this._onAuthorSearch(this.state.lastSearchedValue, newPageNumber);
                break;
            case SEARCH_TYPE.ACTION:
                this._onActionSearch(this.state.lastSearchedValue, newPageNumber);
                break;
        }
    };

    _onActionSearch = (searchValue, newPageNumber = 1) => {
        this.props.loadActions(newPageNumber, null, searchValue);
        if (this.state.searchType === SEARCH_TYPE.ACTION) {
            this.setState({hasSearched: true});
        } else {
            this.setState({hasSearched: true, pageNumber: 1, lastSearchedValue: this.state.searchValue, searchType: SEARCH_TYPE.ACTION});
        }
    };

    _onAuthorSearch = (searchValue, newPageNumber = 1) => {
        this.props.loadActions(newPageNumber, searchValue, null);
        if (this.state.searchType === SEARCH_TYPE.AUTHOR) {
            this.setState({hasSearched: true});
        } else {
            this.setState({hasSearched: true, pageNumber: 1, lastSearchedValue: this.state.searchValue, searchType: SEARCH_TYPE.AUTHOR});
        }
    };

    _onReset = () => {
        this.props.loadActions(1);
        this.setState({hasSearched: false, pageNumber: 1, lastSearchedValue: '', searchType: SEARCH_TYPE.ALL});
    };

    _onAllSearch = (newPageNumber = 1) => {
        this.props.loadActions(newPageNumber);
        if (this.state.searchType === SEARCH_TYPE.ALL) {
            this.setState({hasSearched: false});
        } else {
            this.setState({hasSearched: false, pageNumber: 1, lastSearchedValue: '', searchType: SEARCH_TYPE.ALL});
        }
    };

    render() {
        const {actionsLoaded} = this.props;
        if(!actionsLoaded.actions && (!actionsLoaded.status || actionsLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this._renderHeader()}/>;
        } else if (actionsLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('history.loading-error', {error: actionsLoaded.error.message})}/>
        }
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <div className="input-group history-search">
                <input className="form-control" type="text" onChange={this._handleChange}
                    placeholder={this.i18n('history.search')}/>
                <div className="input-group-btn">
                    <button type="button" className="btn btn-primary" disabled={!this.state.searchValue}
                            onClick={() => this._onActionSearch(this.state.searchValue)}>{this.i18n('history.action')}</button>
                    <button type="button" className="btn btn-primary" disabled={!this.state.searchValue}
                            onClick={() => this._onAuthorSearch(this.state.searchValue)}>{this.i18n('history.author')}</button>
                    <button type="button" className="btn btn-primary"
                            onClick={() => this._onReset()}>{this.i18n('history.reset')}</button>
                </div>

            </div>
            {this.state.hasSearched && <h4>{this.i18n('history.search-results')}</h4>}
            <HistoryTable actions={actionsLoaded.actions} onOpen={this._onOpen}/>
            <nav className="content-center">
                <ul className="pagination">
                    <li className={`page-item ${this.state.pageNumber === 1 && "disabled"}`}>
                        <span className="page-link pointer" onClick={() => this._handlePagination(PAGINATION_DIRECTION.PREVIOUS)}>
                            {this.i18n('history.previous')}</span>
                    </li>
                    <li className="page-item disabled"><span className="page-link">{this.state.pageNumber}</span></li>
                    <li className={`page-item ${actionsLoaded.actions.length <= ACTIONS_PER_PAGE && "disabled"}`}>
                        <span className="page-link pointer" onClick={() => this._handlePagination(PAGINATION_DIRECTION.NEXT)}>
                            {this.i18n('history.next')}</span>
                    </li>
                </ul>
            </nav>
        </Panel>
    }

    _renderHeader() {
        return <span>
            {this.i18n('dashboard.history')}{this.props.actionsLoaded.status === ACTION_STATUS.PENDING && <div className="loader"></div>}
        </span>;

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(ActionsHistory)));

function mapStateToProps(state) {
    return {
        actionsLoaded: state.history.actionsLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadActions: bindActionCreators(loadActions, dispatch),
        transitionToWithOpts:bindActionCreators(transitionToWithOpts, dispatch)
    }
}
