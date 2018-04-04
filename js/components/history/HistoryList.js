'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Panel} from "react-bootstrap";
import {loadActions} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {ACTION_STATUS, ALERT_TYPES, ACTIONS_PER_PAGE, SEARCH_TYPE} from "../../constants/DefaultConstants";
import {LoaderPanel, LoaderSmall} from "../Loader";
import AlertMessage from "../AlertMessage";
import HistoryTable from "./HistoryTable";
import {Routes} from "../../utils/Routes";
import {transitionToWithOpts} from "../../utils/Routing";
import HistorySearch from "./HistorySearch";
import HistoryPagination from "./HistoryPagination";

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
                this._handleSearch(SEARCH_TYPE.ALL, null, newPageNumber);
                break;
            case SEARCH_TYPE.AUTHOR:
                this._handleSearch(SEARCH_TYPE.AUTHOR, this.state.lastSearchedValue, newPageNumber);
                break;
            case SEARCH_TYPE.ACTION:
                this._handleSearch(SEARCH_TYPE.ACTION, this.state.lastSearchedValue, newPageNumber);
                break;
        }
    };

    _handleSearch = (searchType, searchValue = null, newPageNumber = 1) => {
        switch(searchType){
            case SEARCH_TYPE.AUTHOR:
                this.props.loadActions(newPageNumber, searchValue, null);
                break;
            case SEARCH_TYPE.ACTION:
                this.props.loadActions(newPageNumber, null, searchValue);
                break;
            case SEARCH_TYPE.ALL:
                this.props.loadActions(newPageNumber);
                break;
            case SEARCH_TYPE.RESET:
                this.props.loadActions(1);
                this.setState({hasSearched: false, pageNumber: 1, lastSearchedValue: '', searchType: SEARCH_TYPE.ALL});
                return;
        }
        if (this.state.lastSearchedValue === this.state.searchValue) {
            switch(this.state.searchType){
                case SEARCH_TYPE.AUTHOR:
                case SEARCH_TYPE.ACTION:
                    this.setState({hasSearched: true});
                    return;
                case SEARCH_TYPE.ALL:
                    this.setState({hasSearched: false});
                    return;
            }
        }
        this.setState({
            hasSearched: true,
            pageNumber: 1,
            lastSearchedValue: searchType === SEARCH_TYPE.ALL ? '' : this.state.searchValue,
            searchType: searchType
        });
    };

    render() {
        const {actionsLoaded} = this.props;
        if(!actionsLoaded.actions && (!actionsLoaded.status || actionsLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this._renderHeader()}/>;
        } else if (actionsLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('history.loading-error', {error: actionsLoaded.error.message})}/>
        }
        const handlers = {
            handleSearch: this._handleSearch,
            handleChange: this._handleChange
        };
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <HistorySearch handlers={handlers} searchValue={this.state.searchValue}/>
            {this.state.hasSearched && <h4>{this.i18n('history.search-results')}</h4>}
            <HistoryTable actions={actionsLoaded.actions} onOpen={this._onOpen} i18n={this.i18n}/>
            <HistoryPagination pageNumber={this.state.pageNumber}
                               numberOfActions={actionsLoaded.actions.length}
                               handlePagination={this._handlePagination}/>
        </Panel>
    }

    _renderHeader() {
        return <span>
            {this.i18n('dashboard.history')}{this.props.actionsLoaded.status === ACTION_STATUS.PENDING && <LoaderSmall />}
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
