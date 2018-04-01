'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Panel} from "react-bootstrap";

class HistoryAction extends React.Component {
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
            {this.i18n('history.panel-title')}
        </span>;

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(HistoryAction)));

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
