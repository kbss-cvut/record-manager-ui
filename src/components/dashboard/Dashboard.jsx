import React from "react";
import withI18n from "../../i18n/withI18n";
import { FormattedMessage, injectIntl } from "react-intl";
import { Col, Container, Row } from "react-bootstrap";
import DashboardTile from "./DashboardTile";
import PropTypes from "prop-types";
import { processTypeaheadOptions } from "../record/TypeaheadAnswer";
import ImportRecordsDialog from "../record/ImportRecordsDialog";
import { hasRole } from "../../utils/RoleUtils";
import { trackPromise } from "react-promise-tracker";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { ROLE } from "../../constants/DefaultConstants.js";

class Dashboard extends React.Component {
  static propTypes = {
    i18n: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
    formTemplatesLoaded: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.i18n = this.props.i18n;
    this.state = {
      importDialogOpen: false,
    };
  }

  onImportRecords = (file) => {
    trackPromise(this.props.handlers.importRecords(file), "dashboard");
    this.setState({ importDialogOpen: false });
  };

  renderTitle() {
    return (
      <h5 className="formatted-message-size">
        <FormattedMessage
          id="dashboard.welcome"
          values={{ name: <span className="bold">{this.props.currentUser.firstName}</span> }}
        />
      </h5>
    );
  }

  _renderMainDashboard() {
    return (
      <Container>
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
      </Container>
    );
  }

  _renderCreateRecordTile() {
    return hasRole(this.props.currentUser, ROLE.WRITE_ALL_RECORDS) ? (
      <Col md={3} className="dashboard-sector">
        <DashboardTile onClick={this.props.handlers.createRecord}>{this.i18n("dashboard.create-tile")}</DashboardTile>
      </Col>
    ) : (
      ""
    );
  }

  _renderImportRecordsTile() {
    return (
      <Col md={3} className="dashboard-sector">
        <DashboardTile onClick={() => this.setState({ importDialogOpen: true })}>
          {this.i18n("records.import.dialog.title")}
        </DashboardTile>
      </Col>
    );
  }

  _renderShowRecordsTiles() {
    if (hasRole(this.props.currentUser, ROLE.READ_ALL_RECORDS)) {
      return this._renderShowRecordTile();
    } else {
      const formTemplates = this.props.formTemplatesLoaded.formTemplates;
      if (formTemplates) {
        return processTypeaheadOptions(formTemplates, this.props.intl).map((ft, i) =>
          this._renderShowRecordTile(ft, i.toString()),
        );
      }
    }
  }

  _renderShowRecordTile(formTemplate, key) {
    if (!formTemplate) {
      return (
        <Col md={3} className="dashboard-sector">
          <DashboardTile onClick={() => this.props.handlers.showRecords()}>
            {this.i18n("dashboard.records-tile")}
          </DashboardTile>
        </Col>
      );
    }
    const showRecordsOfTemplate = () => {
      return this.props.handlers.showRecords(formTemplate.id);
    };

    return (
      <Col key={key} md={3} className="dashboard-sector">
        <DashboardTile onClick={showRecordsOfTemplate}>{formTemplate.name}</DashboardTile>
      </Col>
    );
  }

  _renderUsersTile() {
    return hasRole(this.props.currentUser, ROLE.READ_ALL_USERS) ? (
      <Col md={3} className="dashboard-sector">
        <DashboardTile onClick={this.props.handlers.showUsers}>{this.i18n("dashboard.users-tile")}</DashboardTile>
      </Col>
    ) : (
      ""
    );
  }

  _renderInstitutionsTile() {
    return hasRole(this.props.currentUser, ROLE.READ_ALL_ORGANIZATIONS) ? (
      <Col md={3} className="dashboard-sector">
        <DashboardTile onClick={this.props.handlers.showInstitutions}>
          {this.i18n("dashboard.institutions-tile")}
        </DashboardTile>
      </Col>
    ) : (
      ""
    );
  }

  _renderStatisticsTile() {
    return hasRole(this.props.currentUser, ROLE.READ_STATISTICS) ? (
      <Col md={3} className="dashboard-sector">
        <DashboardTile onClick={this.props.handlers.showStatistics}>
          {this.i18n("dashboard.statistics-tile")}
        </DashboardTile>
      </Col>
    ) : null;
  }

  render() {
    return (
      <div className="shadow p-4 mb-4 bg-white rounded">
        <PromiseTrackingMask area="dashboard" coverViewport={true} />
        <ImportRecordsDialog
          show={this.state.importDialogOpen}
          onCancel={() => this.setState({ importDialogOpen: false })}
          onSubmit={this.onImportRecords}
        />
        {this.renderTitle()}
        {this._renderMainDashboard()}
      </div>
    );
  }
}

export default injectIntl(withI18n(Dashboard));
