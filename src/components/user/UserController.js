'use strict';

import React from 'react';
import {injectIntl} from "react-intl";
import withI18n from '../../i18n/withI18n';
import User from './User';
import Routes from "../../constants/RoutesConstants";
import {transitionTo, transitionToWithOpts} from '../../utils/Routing';
import {loadInstitutions} from "../../actions/InstitutionsActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_FLAG, ACTION_STATUS} from "../../constants/DefaultConstants";
import {setTransitionPayload} from "../../actions/RouterActions";
import {
    createUser,
    deleteInvitationOption,
    generateUsername,
    impersonate,
    loadUser,
    oidcImpersonate,
    sendInvitation,
    unloadSavedUser,
    unloadUser,
    updateUser
} from "../../actions/UserActions";
import * as UserFactory from "../../utils/EntityFactory";
import omit from 'lodash/omit';
import {getRole} from "../../utils/Utils";
import {isUsingOidcAuth, userProfileLink} from "../../utils/OidcUtils";
import {isAdmin} from "../../utils/SecurityUtils";

class UserController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this._isNew() ? UserFactory.initNewUser() : null,
            saved: false
        };
        this.institution = this._getPayload();
    }

    componentDidMount() {
        if (isAdmin(this.props.currentUser) && !this.props.institutionsLoaded.institutions) {
            this.props.loadInstitutions();
        }
        if (!this.state.user) {
            this.props.loadUser(this.props.match.params.username);
        }
        if (this.state.user && this.state.user.isNew && this.institution) {
            this._onChange({institution: this.institution});
        }
        if (this.props.userSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY && this.props.userSaved.status === ACTION_STATUS.SUCCESS) {
            this.props.unloadSavedUser();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {userLoaded, userSaved, transitionToWithOpts, match, loadUser, generatedUsername} = this.props;

        if (this.state.saved && userLoaded.status !== ACTION_STATUS.PENDING
            && userSaved.status === ACTION_STATUS.SUCCESS) {
            if (userSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                transitionToWithOpts(Routes.editUser, {
                    params: {username: userSaved.user.username},
                    payload: {institution: this.institution}
                });
            } else {
                this.setState({saved: false});
                this.props.loadUser(userSaved.user.username);
            }
        }

        if (prevProps.userLoaded.status === ACTION_STATUS.PENDING && userLoaded.status === ACTION_STATUS.SUCCESS) {
            this.setState({user: userLoaded.user});
        }

        if (prevProps.generatedUsername.status === ACTION_STATUS.PENDING && generatedUsername.status === ACTION_STATUS.SUCCESS) {
            this._onChange({username: generatedUsername.username});
        }

        if (prevProps.match.params.username !== match.params.username) {
            loadUser(match.params.username);
            this.setState({saved: false, invited: false, impersonated: false});
        }
    }

    componentWillUnmount() {
        this.props.unloadUser();
    }

    _isNew() {
        return !this.props.match.params.username;
    }

    _onSave = (sendEmail = true) => {
        let user = this.state.user;
        this.setState({saved: true, invited: false});
        if (user.isNew || (this._isNew() && this.props.userSaved.status === ACTION_STATUS.ERROR)) {
            this.props.createUser(omit(user, 'isNew'));
        } else {
            this.props.updateUser(user, this.props.currentUser, sendEmail);
        }
    };

    _onCancel = () => {
        const handlers = this.props.viewHandlers[Routes.editUser.name];
        if (handlers && !this.institution) {
            transitionTo(handlers.onCancel);
        } else if (this.institution) {
            this.props.transitionToWithOpts(Routes.editInstitution, {params: {key: this.institution.key}});
        } else {
            transitionTo(isAdmin(this.props.currentUser) ? Routes.users : Routes.dashboard);
        }
    };

    _onChange = (change) => {
        const update = {...this.state.user, ...change};
        this.setState({user: update});
    };

    _onPasswordChange = () => {
        this.props.transitionToWithOpts(Routes.passwordChange, {
            params: {username: this.props.match.params.username}
        });
    };

    _generateUsername = () => {
        this.props.generateUsername(getRole(this.state.user).toLowerCase());
    };

    _getPayload() {
        let payload = this._isNew() ? this.props.transitionPayload[Routes.createUser.name] :
            this.props.transitionPayload[Routes.editUser.name];
        this._isNew() ? this.props.setTransitionPayload(Routes.createUser.name, null) :
            this.props.setTransitionPayload(Routes.editUser.name, null);
        return payload ? payload.institution : null;
    }

    _sendInvitation = () => {
        this.setState({deletedInvitation: false, invited: true});
        this.props.sendInvitation(this.state.user.username);
    };

    _deleteInvitationOption = () => {
        this.setState({deletedInvitation: true, invited: false});
        this.props.deleteInvitationOption(this.state.user.username);
    };

    _impersonate = () => {
        this.setState({impersonated: true});
        if (isUsingOidcAuth()) {
            this.props.oidcImpersonate(this.state.user.username);
        } else {
            this.props.impersonate(this.state.user.username);
        }
    };

    _onRedirect = () => {
        if (isUsingOidcAuth()) {
            window.location = userProfileLink();
        }
    }

    render() {
        const {
            currentUser, userSaved, userLoaded, institutionsLoaded,
            invitationSent, impersonation, invitationDelete
        } = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange,
            onPasswordChange: this._onPasswordChange,
            onKeycloakRedirect: this._onRedirect,
            generateUsername: this._generateUsername,
            sendInvitation: this._sendInvitation,
            impersonate: this._impersonate,
            deleteInvitationOption: this._deleteInvitationOption
        };
        return <User user={this.state.user} handlers={handlers} backToInstitution={this.institution !== null}
                     userSaved={userSaved} userLoaded={userLoaded}
                     currentUser={currentUser} institutions={institutionsLoaded.institutions || []}
                     invitationSent={invitationSent} invited={this.state.invited} impersonation={impersonation}
                     invitationDelete={invitationDelete} impersonated={this.state.impersonated}
                     deletedInvitation={this.state.deletedInvitation}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(UserController)));

function mapStateToProps(state) {
    return {
        userSaved: state.user.userSaved,
        userLoaded: state.user.userLoaded,
        currentUser: state.auth.user,
        institutionsLoaded: state.institutions.institutionsLoaded,
        transitionPayload: state.router.transitionPayload,
        viewHandlers: state.router.viewHandlers,
        generatedUsername: state.user.generatedUsername,
        invitationSent: state.user.invitationSent,
        invitationDelete: state.user.invitationDelete,
        impersonation: state.user.impersonation
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: bindActionCreators(createUser, dispatch),
        updateUser: bindActionCreators(updateUser, dispatch),
        loadUser: bindActionCreators(loadUser, dispatch),
        unloadUser: bindActionCreators(unloadUser, dispatch),
        unloadSavedUser: bindActionCreators(unloadSavedUser, dispatch),
        loadInstitutions: bindActionCreators(loadInstitutions, dispatch),
        setTransitionPayload: bindActionCreators(setTransitionPayload, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch),
        generateUsername: bindActionCreators(generateUsername, dispatch),
        sendInvitation: bindActionCreators(sendInvitation, dispatch),
        deleteInvitationOption: bindActionCreators(deleteInvitationOption, dispatch),
        impersonate: bindActionCreators(impersonate, dispatch),
        oidcImpersonate: bindActionCreators(oidcImpersonate, dispatch),
    }
}