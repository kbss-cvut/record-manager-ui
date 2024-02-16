'use strict';

import React from "react";
import * as I18nStore from "../stores/I18nStore";
import {Container, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {authRoutes, unauthRoutes} from "../utils/Routes";
import Routes from "../constants/RoutesConstants";
import {injectIntl} from "react-intl";
import withI18n from "../i18n/withI18n";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_STATUS, ROLE} from "../constants/DefaultConstants";
import {loadUserProfile} from "../actions/AuthActions";
import * as Constants from "../constants/DefaultConstants";
import {LoaderMask} from "./Loader";
import {NavLink, withRouter} from 'react-router-dom';
import {IfGranted} from "react-authorization";
import {transitionTo, transitionToWithOpts} from "../utils/Routing";
import {isUsingOidcAuth, userProfileLink} from "../utils/OidcUtils";
import ImpersonatorBadge from "./ImpersonatorBadge";
import {isAdmin} from "../utils/SecurityUtils";
import Messages from "./message/Messages";

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    componentDidMount() {
        this.props.loadUserProfile();
        I18nStore.setIntl(this.props.intl);
    }

    _renderUsers() {
        const path = this.props.location.pathname;

        return <IfGranted expected={ROLE.ADMIN} actual={this.props.user.role}>
            <NavItem>
                <NavLink to={Routes.users.path} isActive={() => path.startsWith(Routes.users.path)}
                         className="nav-link">{this.i18n('main.users-nav')}</NavLink>
            </NavItem>
        </IfGranted>;
    }

    removeUnsupportedBrowserWarning() {
        const unsupportedBrowserElem = document.getElementById("unsupported-browser");
        if (unsupportedBrowserElem) {
            unsupportedBrowserElem.remove();
        }
    }

    onProfileClick() {
        if (isUsingOidcAuth()) {
            window.location = userProfileLink();
        } else {
            this.props.transitionToWithOpts(Routes.editUser, {params: {username: this.props.user.username}});
        }
    }

    render() {
        if (this.props.status === ACTION_STATUS.PENDING) {
            return <LoaderMask/>;
        }

        this.removeUnsupportedBrowserWarning()

        if (!this.props.isLoaded) {
            return (<div>{unauthRoutes}</div>);
        }
        const user = this.props.user;
        const name = user.firstName.substring(0, 1) + '. ' + user.lastName;
        const path = this.props.location.pathname;

        return (
            <div>
                <header>
                    <Container>
                        <Navbar expand="lg">
                            <Navbar.Brand
                                onClick={() => this.props.history.push(Routes.dashboard.path)}>
                                {Constants.APP_NAME}
                            </Navbar.Brand>
                            <Navbar.Toggle/>
                            <Navbar.Collapse className="justify-content-between">
                                <Nav>
                                    {this._renderUsers()}
                                    {isAdmin(user) ?
                                        <NavItem>
                                            <NavLink to={Routes.institutions.path}
                                                     isActive={() => path.startsWith(Routes.institutions.path)}
                                                     className="nav-link">{this.i18n('main.institutions-nav')}</NavLink>
                                        </NavItem>
                                        : user.institution ?
                                            <NavItem>
                                                <NavLink className="nav-link"
                                                         to={Routes.institutions.path + '/' + user.institution.key}
                                                         isActive={() => path.startsWith(Routes.institutions.path)}>
                                                    {this.i18n('main.institution-nav')}
                                                </NavLink>
                                            </NavItem>
                                            : null
                                    }
                                    <IfGranted expected={ROLE.ADMIN} actual={user.role}>
                                        <NavItem>
                                            <NavLink className="nav-link"
                                                     isActive={() => path.startsWith(Routes.records.path)}
                                                     to={Routes.records.path}>{this.i18n('main.records-nav')}</NavLink>
                                        </NavItem>
                                    </IfGranted>
                                    <IfGranted expected={ROLE.ADMIN} actual={user.role}>
                                        <NavItem>
                                            <NavLink className="nav-link"
                                                     isActive={() => path.startsWith(Routes.statistics.path)}
                                                     to={Routes.statistics.path}>{this.i18n('statistics.panel-title')}</NavLink>
                                        </NavItem>
                                    </IfGranted>
                                    <IfGranted expected={ROLE.ADMIN} actual={user.role}>
                                        <NavItem>
                                            <NavLink className="nav-link"
                                                     isActive={() => path.startsWith(Routes.historyActions.path)}
                                                     to={Routes.historyActions.path}>{this.i18n('main.history')}</NavLink>
                                        </NavItem>
                                    </IfGranted>
                                </Nav>

                                <Nav>
                                    <ImpersonatorBadge/>
                                    <NavDropdown className="pr-0" id='logout' title={name}>
                                        <NavDropdown.Item
                                            onClick={() => this.onProfileClick()}>{this.i18n('main.my-profile')}</NavDropdown.Item>
                                        <NavDropdown.Item
                                            onClick={() => transitionTo(Routes.logout)}>{this.i18n('main.logout')}</NavDropdown.Item>
                                    </NavDropdown>

                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </Container>
                </header>
                <section className="container mt-4" style={{height: '100%'}}>
                    <Messages/>
                    {authRoutes}
                </section>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(withRouter(MainView))));

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        isLoaded: state.auth.isLoaded,
        status: state.auth.status,
        intl: state.intl
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadUserProfile: bindActionCreators(loadUserProfile, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}