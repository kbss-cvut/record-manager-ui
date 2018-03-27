'use strict';

import React from 'react';
import assign from 'object-assign';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import User from './User';
import {Routes} from '../../utils/Routes';
import {transitionTo, transitionToWithOpts} from '../../utils/Routing';
import {loadInstitutions} from "../../actions/InstitutionsActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_FLAG, ACTION_STATUS, ROLE} from "../../constants/DefaultConstants";
import {setTransitionPayload} from "../../actions/RouterActions";
import {createUser, loadUser, unloadSavedUser, unloadUser, updateUser} from "../../actions/UserActions";
import * as UserFactory from "../../utils/EntityFactory";
import omit from 'lodash/omit';
import {loadUsers} from "../../actions/UsersActions";

class UserController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this._isNew() ? UserFactory.initNewUser() : null,
            saved: false,
            showAlert: false
        };
        this.institution = this._getPayload()
    }

    _isNew() {
        return !this.props.params.username;
    }

    componentWillMount() {
        if (!this.state.user) {
            this.props.loadUser(this.props.params.username);
        }
        if (this.state.user && this.state.user.isNew) {
            this.props.loadUsers()
        }
        if(this.state.user && this.state.user.isNew && this.institution) {
            this._onChange({institution: this.institution});
        }
        if(this.props.userSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
            this.setState({showAlert: true});
            this.props.unloadSavedUser();
        }
    }

    componentWillUnmount() {
        this.props.unloadUser();
    }

    componentDidMount() {
        if(this.props.currentUser.role === ROLE.ADMIN && !this.props.institutionsLoaded.institutions) {
            this.props.loadInstitutions();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.saved && nextProps.userLoaded.status !== ACTION_STATUS.PENDING
            && nextProps.userSaved.status === ACTION_STATUS.SUCCESS) {
            if (nextProps.userSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                this.props.transitionToWithOpts(Routes.editUser, {
                    params: {username: nextProps.userSaved.user.username},
                    handlers: {
                        onCancel: Routes.users
                    }
                });
            } else {
                this.setState({saved: false});
                this.props.loadUser(nextProps.userSaved.user.username);
            }
        }
        if (this.props.userLoaded.status === ACTION_STATUS.PENDING && nextProps.userLoaded.status === ACTION_STATUS.SUCCESS) {
            this.setState({user: nextProps.userLoaded.user});
        }
    }

    _onSave = () => {
        let user = this.state.user;
        this.setState({saved: true, showAlert: true});
        if (user.isNew || (this._isNew() && this.props.userSaved.status === ACTION_STATUS.ERROR)) {
            this.props.createUser(omit(user, 'isNew'));
        } else {
            this.props.updateUser(user, this.props.currentUser);
        }
    };

    _onCancel = () => {
        const handlers = this.props.viewHandlers[Routes.editUser.name];
        if (handlers && !this.institution) {
            transitionTo(handlers.onCancel);
        } else if (this.institution) {
            this.props.transitionToWithOpts(Routes.editInstitution, {params: {key: this.institution.key}});
        } else {
            transitionTo(this.props.currentUser.role === ROLE.ADMIN ? Routes.users : Routes.dashboard);
        }
    };

    _onChange = (change) => {
        const update = assign({}, this.state.user, change);
        this.setState({user: update});
    };

    _onPasswordChange = () => {
        this.props.transitionToWithOpts(Routes.passwordChange, {
            params: {username: this.props.params.username}
        });
    };

    _getPayload() {
        let payload = this._isNew() ? this.props.transitionPayload[Routes.createUser.name] :
                                      this.props.transitionPayload[Routes.editUser.name];
        this._isNew() ? this.props.setTransitionPayload(Routes.createUser.name, null) :
                        this.props.setTransitionPayload(Routes.editUser.name, null);
        return payload ? payload.institution : null;
    }

    render() {
        const {currentUser, userSaved, userLoaded, institutionsLoaded, usersLoaded} = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange,
            onPasswordChange: this._onPasswordChange
        };
        return <User user={this.state.user} handlers={handlers} backToInstitution={this.institution !== null}
                     userSaved={userSaved} showAlert={this.state.showAlert} userLoaded={userLoaded}
                     currentUser={currentUser} institutions={institutionsLoaded.institutions || []}
                     usersLoaded={usersLoaded}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(UserController)));

function mapStateToProps(state) {
    return {
        userSaved: state.user.userSaved,
        userLoaded: state.user.userLoaded,
        usersLoaded: state.users.usersLoaded,
        currentUser: state.auth.user,
        institutionsLoaded: state.institutions.institutionsLoaded,
        transitionPayload: state.router.transitionPayload,
        viewHandlers: state.router.viewHandlers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: bindActionCreators(createUser, dispatch),
        updateUser: bindActionCreators(updateUser, dispatch),
        loadUser: bindActionCreators(loadUser, dispatch),
        loadUsers: bindActionCreators(loadUsers, dispatch),
        unloadUser: bindActionCreators(unloadUser, dispatch),
        unloadSavedUser: bindActionCreators(unloadSavedUser, dispatch),
        loadInstitutions: bindActionCreators(loadInstitutions, dispatch),
        setTransitionPayload: bindActionCreators(setTransitionPayload, dispatch),
        transitionToWithOpts:bindActionCreators(transitionToWithOpts, dispatch)
    }
}