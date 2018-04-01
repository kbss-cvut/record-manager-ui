'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Panel} from "react-bootstrap";

class HistoryActions extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
