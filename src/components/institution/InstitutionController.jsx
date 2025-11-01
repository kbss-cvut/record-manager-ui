import React from "react";
import Institution from "./Institution";
import { injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import Routes from "../../constants/RoutesConstants";
import { transitionTo, transitionToWithOpts } from "../../utils/Routing";
import { connect } from "react-redux";
import {
  ACTION_FLAG,
  ACTION_STATUS,
  DEFAULT_PAGE_SIZE,
  ROLE,
  SortDirection,
  STORAGE_TABLE_PAGE_SIZE_KEY,
} from "../../constants/DefaultConstants";
import { bindActionCreators } from "redux";
import {
  createInstitution,
  loadInstitution,
  unloadInstitution,
  unloadSavedInstitution,
  updateInstitution,
} from "../../actions/InstitutionActions";
import { sortToParams } from "../../utils/Utils";
import { deleteUser, loadInstitutionMembers, unloadInstitutionMembers } from "../../actions/UserActions";
import * as EntityFactory from "../../utils/EntityFactory";
import { exportRecords, loadRecords } from "../../actions/RecordsActions";
import omit from "lodash/omit";
import { loadFormTemplates } from "../../actions/FormTemplatesActions";
import { canReadInstitutionUsers, hasRole } from "../../utils/RoleUtils.js";
import { trackPromise } from "react-promise-tracker";
import { INITIAL_PAGE } from "../misc/Pagination";
import BrowserStorage from "../../utils/BrowserStorage";
import PropTypes from "prop-types";
import { canReadInstitutionRecords } from "../../utils/RoleUtils.js";

class InstitutionController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      institution: this._isNew() ? EntityFactory.initNewInstitution() : null,
      saved: false,
      pageNumber: INITIAL_PAGE,
      filters: {},
      sort: {
        date: SortDirection.DESC,
      },
    };
  }

  componentDidMount() {
    const institutionKey = this.props.match.params.key;
    const { currentUser } = this.props;

    if (!this.state.institution) {
      trackPromise(this.props.loadInstitution(institutionKey), "institution");
    }

    if (institutionKey) {
      if (canReadInstitutionUsers(currentUser, institutionKey)) {
        trackPromise(this.props.loadInstitutionMembers(institutionKey), "institution-members");
      }

      if (
        this.props.status === ACTION_STATUS.SUCCESS &&
        canReadInstitutionRecords(this.props.currentUser, institutionKey)
      ) {
        this._loadRecords();
      }
    }
    if (
      this.props.institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY &&
      this.props.institutionSaved.status === ACTION_STATUS.SUCCESS
    ) {
      this.props.unloadSavedInstitution();
    }
    this.props.loadFormTemplates();
  }

  _loadRecords() {
    const institutionKey = this.props.match.params.key;
    this.props.loadRecords({
      institution: institutionKey,
      page: this.state.pageNumber,
      size: BrowserStorage.get(STORAGE_TABLE_PAGE_SIZE_KEY, DEFAULT_PAGE_SIZE),
      sort: sortToParams(this.state.sort),
    });
  }

  componentDidUpdate(prevProps) {
    const { institutionLoaded, institutionSaved, transitionToWithOpts } = this.props;

    if (
      prevProps.institutionLoaded.status === ACTION_STATUS.PENDING &&
      institutionLoaded.status === ACTION_STATUS.SUCCESS
    ) {
      this.setState({ institution: institutionLoaded.institution });
    }

    if (
      this.state.saved &&
      institutionLoaded.status !== ACTION_STATUS.PENDING &&
      institutionSaved.status === ACTION_STATUS.SUCCESS
    ) {
      if (institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
        transitionToWithOpts(Routes.editInstitution, {
          params: { key: institutionSaved.institution.key },
          handlers: {
            onCancel: Routes.institutions,
          },
        });
      } else {
        this.setState({ saved: false });
        this.props.loadInstitution(this.state.institution.key);
      }
    }
  }

  componentWillUnmount() {
    this.props.unloadInstitution();
    this.props.unloadInstitutionMembers();
  }

  _isNew() {
    return !this.props.match.params.key;
  }

  _onSave = () => {
    const institution = this.state.institution;
    this.setState({ saved: true });
    if (institution.isNew || (this._isNew() && this.props.institutionSaved.status === ACTION_STATUS.ERROR)) {
      trackPromise(this.props.createInstitution(omit(institution, "isNew")), "institution");
    } else {
      trackPromise(this.props.updateInstitution(institution), "institution");
    }
  };

  _onCancel = () => {
    const handlers = this.props.viewHandlers[Routes.editInstitution.name];
    if (handlers) {
      transitionTo(handlers.onCancel);
    } else if (hasRole(this.props.currentUser, ROLE.WRITE_ALL_ORGANIZATIONS)) {
      transitionTo(Routes.institutions);
    } else {
      transitionTo(Routes.dashboard);
    }
  };

  _onChange = (change) => {
    const update = { ...this.state.institution, ...change };
    this.setState({ institution: update });
  };

  _onDeleteUser = (user) => {
    trackPromise(this.props.deleteUser(user, this.state.institution), "institution-members");
  };

  _onEditUser = (user, institution) => {
    this.props.transitionToWithOpts(Routes.editUser, {
      params: { username: user.username },
      payload: { institution: institution },
    });
  };

  _onEditRecord = (record) => {
    this.props.transitionToWithOpts(Routes.editRecord, { params: { key: record.key } });
  };

  _onExportRecords = (exportType) => {
    const institutionKey = this.state.institution.key;
    this.props.exportRecords(exportType, { institution: institutionKey, sort: sortToParams(this.state.sort) });
  };

  _onAddNewUser = (institution) => {
    this.props.transitionToWithOpts(Routes.createUser, {
      payload: { institution: institution },
    });
  };

  onFilterAndSort = (filterChange, sortChange) => {
    this.setState(
      {
        filters: Object.assign({}, this.state.filters, filterChange),
        sort: Object.assign({}, this.state.sort, sortChange),
      },
      this._loadRecords,
    );
  };

  render() {
    const {
      currentUser,
      institutionLoaded,
      institutionSaved,
      institutionMembers,
      recordsLoaded,
      formTemplatesLoaded,
      userDeleted,
    } = this.props;
    if (!currentUser) {
      return null;
    }
    const handlers = {
      onSave: this._onSave,
      onCancel: this._onCancel,
      onChange: this._onChange,
      onEditUser: this._onEditUser,
      onAddNewUser: this._onAddNewUser,
      onEditRecord: this._onEditRecord,
      onExportRecords: this._onExportRecords,
      onDelete: this._onDeleteUser,
    };
    const filterAndSort = {
      filters: this.state.filters,
      sort: this.state.sort,
      onChange: this.onFilterAndSort,
    };
    return (
      <Institution
        handlers={handlers}
        institution={this.state.institution}
        institutionMembers={institutionMembers}
        recordsLoaded={recordsLoaded}
        formTemplatesLoaded={formTemplatesLoaded}
        currentUser={currentUser}
        institutionLoaded={institutionLoaded}
        institutionSaved={institutionSaved}
        userDeleted={userDeleted}
        filterAndSort={filterAndSort}
      />
    );
  }
}

InstitutionController.propTypes = {
  userDeleted: PropTypes.object,
  unloadInstitutionMembers: PropTypes.func.isRequired,
  unloadInstitution: PropTypes.func.isRequired,
  transitionToWithOpts: PropTypes.func.isRequired,
  loadRecords: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  loadInstitution: PropTypes.func.isRequired,
  loadInstitutionMembers: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  institutionSaved: PropTypes.object.isRequired,
  unloadSavedInstitution: PropTypes.func.isRequired,
  loadFormTemplates: PropTypes.func.isRequired,
  institutionLoaded: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
  createInstitution: PropTypes.func.isRequired,
  updateInstitution: PropTypes.func.isRequired,
  viewHandlers: PropTypes.object.isRequired,
  exportRecords: PropTypes.func.isRequired,
  institutionMembers: PropTypes.object.isRequired,
  recordsLoaded: PropTypes.object.isRequired,
  formTemplatesLoaded: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(InstitutionController)));

function mapStateToProps(state) {
  return {
    currentUser: state.auth.user,
    status: state.auth.status,
    institutionLoaded: state.institution.institutionLoaded,
    institutionSaved: state.institution.institutionSaved,
    institutionMembers: state.user.institutionMembers,
    recordsLoaded: state.records.recordsLoaded,
    formTemplatesLoaded: state.formTemplates.formTemplatesLoaded,
    viewHandlers: state.router.viewHandlers,
    userDeleted: state.user.userDeleted,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadInstitution: bindActionCreators(loadInstitution, dispatch),
    unloadInstitution: bindActionCreators(unloadInstitution, dispatch),
    unloadSavedInstitution: bindActionCreators(unloadSavedInstitution, dispatch),
    createInstitution: bindActionCreators(createInstitution, dispatch),
    updateInstitution: bindActionCreators(updateInstitution, dispatch),
    loadInstitutionMembers: bindActionCreators(loadInstitutionMembers, dispatch),
    loadRecords: bindActionCreators(loadRecords, dispatch),
    loadFormTemplates: bindActionCreators(loadFormTemplates, dispatch),
    deleteUser: bindActionCreators(deleteUser, dispatch),
    transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch),
    unloadInstitutionMembers: bindActionCreators(unloadInstitutionMembers, dispatch),
    exportRecords: bindActionCreators(exportRecords, dispatch),
  };
}
