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
import HistoryPagination from "./HistoryPagination";
import assign from "object-assign";

class ActionsHistory extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            searchData: {},
            pageNumber: 1
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
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState({searchData: assign({}, this.state.searchData, change), pageNumber: 1});
    };

    _onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this._handleSearch();
        }
    };

    _handleSearch = (newPageNumber = 1) => {
        this.props.loadActions(newPageNumber, this.state.searchData);
    };

    _handleReset = () => {
        this.setState({searchData: {}, pageNumber: 1});
        this.props.loadActions(1, {});
    };

    _handlePagination = (direction) => {
        if (this.props.actionsLoaded.actions.length <= ACTIONS_PER_PAGE && direction === 1 ||
            this.state.pageNumber === 1 && direction === -1) {
            return;
        }
        const newPageNumber = this.state.pageNumber + direction;
        this.setState({pageNumber: newPageNumber});
        this._handleSearch(newPageNumber);
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
            handleReset: this._handleReset,
            handleChange: this._handleChange,
            onKeyPress: this._onKeyPress,
            onOpen: this._onOpen
        };
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <HistoryTable handlers={handlers} searchData={this.state.searchData}
                          actions={actionsLoaded.actions} i18n={this.i18n}/>
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
