'use strict';

import React from "react";
import Actions from "../../actions/Actions";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import Institutions from "./Institutions";
import InstitutionStore from "../../stores/InstitutionStore";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import {connect} from "react-redux";
import {ROLE} from "../../constants/DefaultConstants";

class InstitutionsController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            institutions: InstitutionStore.getInstitutions()
        };
    }

    componentDidMount() {
        Actions.loadAllInstitutions();
        this.unsubscribe = InstitutionStore.listen(this._onInstitutionsLoaded);
    }

    _onInstitutionsLoaded = (data) => {
        if (data.action !== Actions.loadAllInstitutions) {
            return;
        }
        this.setState({institutions: data.data});
    };

    componentWillUnmount() {
        this.unsubscribe();
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
        Actions.deleteInstitution(institution, Actions.loadAllInstitutions);
    };

    render() {
        const {currentUser} = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN) {
            return null;
        }
        var handlers = {
            onEdit: this._onEditInstitution,
            onCreate: this._onAddInstitution,
            onDelete: this._onDeleteInstitution
        };
        return <Institutions institutions={this.state.institutions} handlers={handlers} currentUser={this.props.currentUser}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(InstitutionsController))));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}