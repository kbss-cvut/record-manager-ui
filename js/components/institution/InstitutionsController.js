'use strict';

import React from "react";
import Actions from "../../actions/Actions";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import Institutions from "./Institutions";
import InstitutionStore from "../../stores/InstitutionStore";

export default class InstitutionsController extends React.Component {
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
        var handlers = {
            onEdit: this._onEditInstitution,
            onCreate: this._onAddInstitution,
            onDelete: this._onDeleteInstitution
        };
        return <Institutions institutions={this.state.institutions} handlers={handlers}/>;
    }
}
