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
    }

    componentDidMount() {
        this.props.loadActions();
    }

    _onOpen = (key) => {
        this.props.transitionToWithOpts(Routes.historyAction, {
            params: {key}
        });
    };

    render() {
        const {actionsLoaded} = this.props;
        if(!actionsLoaded.actions && (!actionsLoaded.status || actionsLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this._renderHeader()}/>;
        } else if(actionsLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('users.loading-error', {error: actionsLoaded.error.message})}/>
        }
        return <Panel header={this._renderHeader()} bsStyle='primary'>
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
