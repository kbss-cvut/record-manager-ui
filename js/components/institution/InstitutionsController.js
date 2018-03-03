'use strict';

import React from "react";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import Institutions from "./Institutions";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import {connect} from "react-redux";
import {ROLE} from "../../constants/DefaultConstants";
import {deleteInstitution, loadInstitutions} from "../../actions";
import {bindActionCreators} from "redux";

class InstitutionsController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    componentDidMount() {
        this.props.loadInstitutions();
    }

    _onEditInstitution = (institution) => {
        Routing.transitionTo(Routes.editInstitution, {
            params: {key: institution.key},
            handlers: {
                onCancel: Routes.institutions
            }
        });
    };

    _onAddInstitution = () => {
        Routing.transitionTo(Routes.createInstitution, {
            handlers: {
                onSuccess: Routes.institutions,
                onCancel: Routes.institutions
            }
        });
    };

    _onDeleteInstitution = (institution) => {
        this.props.deleteInstitution(institution);
        this.setState({showAlert: true});
    };

    render() {
        const {currentUser, institutionsLoaded, institutionDeleted} = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN) {
            return null;
        }
        const handlers = {
            onEdit: this._onEditInstitution,
            onCreate: this._onAddInstitution,
            onDelete: this._onDeleteInstitution
        };
        return <Institutions institutions={institutionsLoaded.institutions || []} showAlert={this.state.showAlert}
                             handlers={handlers} institutionDeleted={institutionDeleted} status={institutionsLoaded.status}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(InstitutionsController))));

function mapStateToProps(state) {
    return {
        institutionsLoaded: state.institutions.institutionsLoaded,
        institutionDeleted: state.institution.institutionDeleted,
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteInstitution: bindActionCreators(deleteInstitution, dispatch),
        loadInstitutions: bindActionCreators(loadInstitutions, dispatch)
    }
}