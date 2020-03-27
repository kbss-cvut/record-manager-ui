'use strict';

import React from "react";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {Col, Jumbotron, Container, Row} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
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
        return <Container>
            <div>
                <Row>
                    <Col md={3} className='dashboard-sector'>
                        <DashboardTile
                            onClick={this.props.handlers.createRecord}>{this.i18n('dashboard.create-tile')}</DashboardTile>
                    </Col>
                    {this._renderUsersTile()}
                    {this._renderInstitutionsTile()}
                    <Col md={3} className='dashboard-sector'>
                        <DashboardTile
                            onClick={this.props.handlers.showRecords}>{this.i18n('dashboard.records-tile')}</DashboardTile>
                    </Col>
                </Row>
                <Row>
                    {this._renderStatisticsTile()}
                </Row>
            </div>
        </Container>;
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

export default injectIntl(I18nWrapper(Dashboard));
