'use strict';

import React from 'react';
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Card, Table} from "react-bootstrap";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import {LoaderCard, LoaderSmall} from "../Loader";
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
            return <LoaderCard header={this._renderHeader()}/>;
        } else if (status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('history.loading-error', {error: error.message})}/>
        }
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this.i18n('statistics.panel-title')}
                {this.props.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
            </Card.Header>
            <Card.Body>
            <Table size="sm" responsive striped bordered hover>
                <tbody>
                {this._renderTableRow()}
                </tbody>
            </Table>
            </Card.Body>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(Statistics)));

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
