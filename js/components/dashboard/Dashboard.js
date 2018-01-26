'use strict';

import React from "react";
import Authentication from "../../utils/Authentication";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {Col, Jumbotron, Grid} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import DashboardTile from "./DashboardTile";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    onUserLoaded(user) {
        this.setState({firstName: user.firstName});
    }

    renderTitle() {
        return <h3>
            <FormattedMessage id='dashboard.welcome' values={{name: <span className='bold'>{this.props.userFirstName}</span>}}/>
        </h3>;
    }

    _renderMainDashboard() {
        return <Grid fluid={true}>
            <div>
                <Col xs={3}  className='dashboard-sector'>
                    <DashboardTile onClick={this.props.handlers.createRecord}>{this.i18n('dashboard.create-tile')}</DashboardTile>
                </Col>
                {this._renderUsersTile()}
                <Col xs={3} className='dashboard-sector'>
                    <DashboardTile onClick={this.props.handlers.showInstitutions}>{this.i18n('dashboard.institutions-tile')}</DashboardTile>
                </Col>
                <Col xs={3} className='dashboard-sector'>
                    <DashboardTile onClick={this.props.handlers.showRecords}>{this.i18n('dashboard.records-tile')}</DashboardTile>
                </Col>
            </div>
        </Grid>;
    }

    _renderUsersTile() {
        return Authentication.isAdmin() ?
            <Col xs={3} className='dashboard-sector'>
                <DashboardTile onClick={this.props.handlers.showUsers}>{this.i18n('dashboard.users-tile')}</DashboardTile>
            </Col> : null;
    }

    render() {
        return (
            <div style={{margin: '0 -15px 0 -15px'}}>
                <div className='col-xs-10'>
                    <Jumbotron>
                        {this.renderTitle()}
                        {this._renderMainDashboard()}
                    </Jumbotron>
                </div>
            </div>

        );
    }
}

Dashboard.propTypes = {
    userFirstName: React.PropTypes.string,
    handlers: React.PropTypes.object
};

export default injectIntl(I18nWrapper(Dashboard));
