'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Panel} from "react-bootstrap";
import {loadActions} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
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
            hasSearched: false
        }
    }

    componentDidMount() {
        this.props.loadActions();
    }

    _onOpen = (key) => {
        this.props.transitionToWithOpts(Routes.historyAction, {
            params: {key}
        });
    };

    _handleChange = (e) => {
        this.setState({searchValue: e.target.value});
    };

    _onActionSearch = () => {
        this.props.loadActions(null, this.state.searchValue);
        this.setState({hasSearched: true});
    };

    _onAuthorSearch = () => {
        this.props.loadActions(this.state.searchValue);
        this.setState({hasSearched: true});
    };

    _onAllSearch = () => {
        this.props.loadActions();
        this.setState({hasSearched: false});
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
                            onClick={this._onActionSearch}>Action</button>
                    <button type="button" className="btn btn-primary" disabled={!this.state.searchValue}
                            onClick={this._onAuthorSearch}>Author</button>
                    <button type="button" className="btn btn-primary" disabled={!this.state.hasSearched}
                            onClick={this._onAllSearch}>All</button>
                </div>

            </div>
            {this.state.hasSearched && <p>Search results</p>}
            <HistoryTable actions={actionsLoaded.actions} onOpen={this._onOpen}/>
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
