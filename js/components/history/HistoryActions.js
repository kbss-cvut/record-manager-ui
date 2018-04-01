'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Panel} from "react-bootstrap";
import {loadActions} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";

class HistoryActions extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    componentDidMount() {
        this.props.loadActions();
    }

    render() {
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <i>Test</i>
        </Panel>
    }

    _renderHeader() {
        return <span>
            {this.i18n('dashboard.history')}{/*this.props.historyLoaded.status === ACTION_STATUS.PENDING && <div className="loader"></div>*/}
        </span>;

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(HistoryActions)));

function mapStateToProps(state) {
    return {
        actions: state.history.actions,
        status: state.history.status
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadActions: bindActionCreators(loadActions, dispatch)
    }
}
