'use strict';

import React, {Fragment} from 'react';
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Card} from "react-bootstrap";
import {loadActions} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {ACTION_STATUS, ALERT_TYPES, ACTIONS_PER_PAGE} from "../../constants/DefaultConstants";
import {LoaderCard, LoaderSmall} from "../Loader";
import AlertMessage from "../AlertMessage";
import HistoryTable from "./HistoryTable";
import Routes from "../../constants/RoutesConstants";
import {transitionToWithOpts} from "../../utils/Routing";
import HistoryPagination from "./HistoryPagination";

class HistoryList extends React.Component {
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
        this.setState({searchData: {...this.state.searchData, ...change}, pageNumber: 1});
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
        if (!actionsLoaded.actions && (!actionsLoaded.status || actionsLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderCard header={this._renderHeader()}/>;
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
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this._renderHeader()}
            </Card.Header>
            <Card.Body><HistoryTable handlers={handlers} searchData={this.state.searchData}
                                     actions={actionsLoaded.actions} i18n={this.i18n}/>
                <HistoryPagination pageNumber={this.state.pageNumber}
                                   numberOfActions={actionsLoaded.actions.length}
                                   handlePagination={this._handlePagination}/>
            </Card.Body>
        </Card>
    }

    _renderHeader = () => {
        return <Fragment>
            {this.i18n('main.history')}{this.props.actionsLoaded.status === ACTION_STATUS.PENDING &&
        <LoaderSmall/>}
        </Fragment>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(HistoryList)));

function mapStateToProps(state) {
    return {
        actionsLoaded: state.history.actionsLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadActions: bindActionCreators(loadActions, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}
