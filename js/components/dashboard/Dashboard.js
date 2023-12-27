import React from "react";
import withI18n from "../../i18n/withI18n";
import {FormattedMessage, injectIntl} from "react-intl";
import {Col, Container, Jumbotron, Row} from "react-bootstrap";
import DashboardTile from "./DashboardTile";
import PropTypes from "prop-types";
import {processTypeaheadOptions} from "../record/TypeaheadAnswer";
import ImportRecordsDialog from "../record/ImportRecordsDialog";
import {isAdmin} from "../../utils/SecurityUtils";
import {trackPromise} from "react-promise-tracker";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            importDialogOpen: false
        };
    }

    onImportRecords = (file) => {
        trackPromise(this.props.handlers.importRecords(file), "dashboard");
        this.setState({importDialogOpen: false});
    };

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
                    {this._renderCreateRecordTile()}
                    {this._renderImportRecordsTile()}
                    {this._renderShowRecordsTiles()}
                </Row>
                <Row>
                    {this._renderUsersTile()}
                    {this._renderInstitutionsTile()}
                    {this._renderStatisticsTile()}
                </Row>
            </div>
        </Container>;
    }

    _renderCreateRecordTile() {
        return this._isAdmin()
            ? <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.createRecord}>{this.i18n('dashboard.create-tile')}</DashboardTile>
            </Col>
            : "";
    }

    _renderImportRecordsTile() {
        return <Col md={3} className='dashboard-sector'>
            <DashboardTile
                onClick={() => this.setState({importDialogOpen: true})}>{this.i18n('records.import.dialog.title')}</DashboardTile>
        </Col>
    }

    _renderShowRecordsTiles() {
        if (this._isAdmin()) {
            return this._renderShowRecordTile();
        } else {
            const formTemplates = this.props.formTemplatesLoaded.formTemplates;
            if (formTemplates) {

                return processTypeaheadOptions(formTemplates, this.props.intl)
                    .map((ft, i) => this._renderShowRecordTile(ft, i.toString()))
            }
        }
    }

    _renderShowRecordTile(formTemplate, key) {
        if (!formTemplate) {
            return <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={() => this.props.handlers.showRecords()}>{this.i18n('dashboard.records-tile')}</DashboardTile>
            </Col>
        }
        const showRecordsOfTemplate = () => {
            return this.props.handlers.showRecords(formTemplate.id)
        }

        return <Col key={key} md={3} className='dashboard-sector'>
            <DashboardTile
                onClick={showRecordsOfTemplate}>{formTemplate.name}</DashboardTile>
        </Col>
    }

    _renderUsersTile() {
        return this._isAdmin() ?
            <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showUsers}>{this.i18n('dashboard.users-tile')}</DashboardTile>
            </Col>
            : "";
    }

    _renderInstitutionsTile() {
        return this._isAdmin() ?
            <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showInstitutions}>{this.i18n('dashboard.institutions-tile')}</DashboardTile>
            </Col>
            : "";
    }

    _renderStatisticsTile() {
        return this._isAdmin() ?
            <Col md={3} className='dashboard-sector'>
                <DashboardTile
                    onClick={this.props.handlers.showStatistics}>{this.i18n('dashboard.statistics-tile')}</DashboardTile>
            </Col> : null;
    }

    _isAdmin() {
        return isAdmin(this.props.currentUser);
    }

    render() {
        return (
            <Jumbotron>
                <PromiseTrackingMask area="dashboard" coverViewport={true}/>
                <ImportRecordsDialog show={this.state.importDialogOpen}
                                     onCancel={() => this.setState({importDialogOpen: false})}
                                     onSubmit={this.onImportRecords}/>
                {this.renderTitle()}
                {this._renderMainDashboard()}
            </Jumbotron>
        );
    }
}

Dashboard.propTypes = {
    currentUser: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
    formTemplatesLoaded: PropTypes.object.isRequired
};

export default injectIntl(withI18n(Dashboard));
