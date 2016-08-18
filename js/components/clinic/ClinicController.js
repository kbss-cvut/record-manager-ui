'use strict';

import React from 'react';
import assign from 'object-assign';

import Actions from '../../actions/Actions';
import Clinic from './Clinic';
import ClinicStore from '../../stores/ClinicStore';
import EntityFactory from '../../utils/EntityFactory';
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';
import UserStore from '../../stores/UserStore';

export default class ClinicController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clinic: this._isNew() ? EntityFactory.initNewClinic() : null,
            members: [],
            loading: false
        };
    }

    _isNew() {
        return !this.props.params.key;
    }

    componentWillMount() {
        if (!this.state.clinic) {
            Actions.loadClinic(this.props.params.key);
            this.setState({loading: true});
        }
        if (this.props.params.key) {
            Actions.loadClinicMembers(this.props.params.key);
        }
        this.unsubscribe = ClinicStore.listen(this._onClinicLoaded);
        this.unsubscribeMembers = UserStore.listen(this._onMembersLoaded);
    }

    _onClinicLoaded = (data) => {
        if (data.action === Actions.loadClinic) {
            this.setState({clinic: data.data, loading: false});
        }
    };

    _onMembersLoaded = (data) => {
        if (data.action === Actions.loadClinicMembers && this.props.params.key === data.clinicKey) {
            this.setState({members: data.data});
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribeMembers();
    }

    _onSave = () => {
        var clinic = this.state.clinic;
        if (clinic.isNew) {
            delete clinic.isNew;
            Actions.createClinic(clinic, this._onSaveSuccess, this._onSaveError);
        } else {
            Actions.updateClinic(clinic, this._onSaveSuccess, this._onSaveError);
        }
    };

    _onSaveSuccess = () => {

    };

    _onSaveError = () => {

    };

    _onCancel = () => {
        var handlers = RouterStore.getViewHandlers(Routes.editClinic.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.clinics);
        }
    };

    _onChange = (change) => {
        var update = assign({}, this.state.clinic, change);
        this.setState({clinic: update});
    };

    render() {
        return <Clinic onSave={this._onSave} onCancel={this._onCancel} onChange={this._onChange}
                       clinic={this.state.clinic} members={this.state.members} loading={this.state.loading}/>;
    }
}
