'use strict';

import React from "react";
import withI18n from "../../i18n/withI18n";
import {FormattedMessage, injectIntl} from "react-intl";
import {Col, Container, Jumbotron, Row} from "react-bootstrap";
import DashboardTile from "./DashboardTile";
import {ROLE} from "../../constants/DefaultConstants";
import PropTypes from "prop-types";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    renderTitle() {
        return <h5 className='formatted-message-size'>
            <FormattedMessage id='dashboard.welcome'
                              values={{name: <span className='bold'>{this.props.currentUser.firstName}</span>}}/>
        </h5>;
    }

    _renderMainDashboard() {
        const {
            formTemplatesLoaded
        } = this.props;
        return <Container>
            <div>
                <Row>
                    {this._renderCreateRecordTile()}
                    {this._renderUsersTile()}
                    {this._renderInstitutionsTile()}
                    {this._renderShowRecordsTile()}
                </Row>
                <Row>
                    {this._renderStatisticsTile()}
                </Row>
            </div>
        </Container>;
    }

    _renderShowRecordsTile() {
        return <Col md={3} className='dashboard-sector'>
            <DashboardTile
                onClick={this.props.handlers.showRecords}>{this.i18n('dashboard.records-tile')}</DashboardTile>
        </Col>;
    }

    _renderCreateRecordTile() {
        return <Col md={3} className='dashboard-sector'>
            <DashboardTile
                onClick={this.props.handlers.createRecord}>{this.i18n('dashboard.create-tile')}</DashboardTile>
        </Col>;
    }

    _renderUsersTile() {
        return this.props.currentUser.role === ROLE.ADMIN ?
            <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showUsers}>{this.i18n('dashboard.users-tile')}</DashboardTile>
            </Col>
            : <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showMyProfile}>{this.i18n('dashboard.user-tile')}</DashboardTile>
            </Col>;
    }

    _renderInstitutionsTile() {
        return this.props.currentUser.role === ROLE.ADMIN ?
            <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showInstitutions}>{this.i18n('dashboard.institutions-tile')}</DashboardTile>
            </Col>
            : this.props.currentUser.institution ?
                <Col md={3} className='dashboard-sector'>
                    <DashboardTile
                        onClick={this.props.handlers.showMyInstitution}>{this.i18n('dashboard.institution-tile')}</DashboardTile>
                </Col>
                : null;
    }

    _renderStatisticsTile() {
        return this.props.currentUser.role === ROLE.ADMIN ?
            <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showStatistics}>{this.i18n('dashboard.statistics-tile')}</DashboardTile>
            </Col> : null;
    }

    render() {
        return (
            <Jumbotron>
                {this.renderTitle()}
                {this._renderMainDashboard()}
            </Jumbotron>
        );
    }
}

Dashboard.propTypes = {
    currentUser: PropTypes.object,
    handlers: PropTypes.object
};

export default injectIntl(withI18n(Dashboard));
