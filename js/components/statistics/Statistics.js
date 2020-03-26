'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Card, Table} from "react-bootstrap";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import {LoaderPanel, LoaderSmall} from "../Loader";
import AlertMessage from "../AlertMessage";
import {bindActionCreators} from "redux";
import {loadStatistics} from "../../actions/StatisticsActions";

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    componentDidMount() {
        this.props.loadStatistics();
    }

    render() {
        const {statistics, status, error} = this.props;
        if (!statistics && (!status || status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this._renderHeader()}/>;
        } else if (status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('history.loading-error', {error: error.message})}/>
        }
        return <Card variant='primary'>
            <Card.Header>
                {this.i18n('statistics.panel-title')}
                {this.props.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
            </Card.Header>
            <Table size="sm" responsive striped bordered hover>
                <tbody>
                {this._renderTableRow()}
                </tbody>
            </Table>
        </Card>
    }

    _renderHeader() {
        return <span>
            {this.i18n('statistics.panel-title')}{this.props.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
        </span>;

    }

    _renderTableRow() {
        const {data} = this.props;
        return Object.keys(data).map((key, index) => {
            return <tr key={index}>
                <th className='w-50 content-center'>{this.i18n(`statistics.${key}`)}</th>
                <td className='w-50 content-center'>{data[key]}</td>
            </tr>;
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(Statistics)));

function mapStateToProps(state) {
    return {
        status: state.statistics.status,
        error: state.statistics.error,
        data: state.statistics.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadStatistics: bindActionCreators(loadStatistics, dispatch)
    }
}
