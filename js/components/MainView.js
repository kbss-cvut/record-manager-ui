'use strict';

import React from "react";
import * as I18nStore from "../stores/I18nStore";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Routes} from "../utils/Routes";
import {injectIntl} from "react-intl";
import I18nWrapper from "../i18n/I18nWrapper";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_STATUS, ROLE} from "../constants/DefaultConstants";
import {loadUserProfile} from "../actions/AuthActions";
import * as Constants from "../constants/DefaultConstants";
import {LoaderMask} from "./Loader";

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    componentWillMount() {
        I18nStore.setIntl(this.props.intl);
    }

    _renderUsers() {
        return this.props.user.role === ROLE.ADMIN ?
                <LinkContainer to='users'><NavItem>{this.i18n('main.users-nav')}</NavItem></LinkContainer>
            : null;
    }

    render() {
        if (this.props.status === ACTION_STATUS.PENDING) {
            return <LoaderMask />;
        } else if (!this.props.isLoaded) {
            return (<div>{this.props.children}</div>);
        }
        const user = this.props.user;
        const name = user.firstName.substr(0, 1) + '. ' + user.lastName;
        return (
            <div>
                {this.props.location.pathname !== `/${Routes.login.path}` &&
                <header>
                    <Navbar collapseOnSelect>
                        <Navbar.Header>
                        <Navbar.Brand>
                            <a href={`#/${Routes.dashboard.path}`}>{Constants.APP_NAME}</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                        <Nav pullLeft>
                        {this._renderUsers()}
                            {user.role === ROLE.ADMIN ?
                                <LinkContainer to='institutions'>
                                    <NavItem>{this.i18n('main.institutions-nav')}</NavItem>
                                </LinkContainer>
                                : user.institution ?
                                    <LinkContainer to={{ pathname: '/institutions/'+user.institution.key}}>
                                    <NavItem>{this.i18n('main.institution-nav')}</NavItem>
                                </LinkContainer>
                                    : null
                            }
                            <LinkContainer
                                to='records'><NavItem>{this.i18n('main.records-nav')}</NavItem></LinkContainer>
                            {user.role === ROLE.ADMIN &&
                            <LinkContainer
                                to='history'><NavItem>{this.i18n('main.history')}</NavItem></LinkContainer>
                            }
                        </Nav>

                            <Nav pullRight>
                            <NavDropdown id='logout' title={name}>
                                <MenuItem
                                    href={'#/' + Routes.users.path + '/' + user.username}>{this.i18n('main.my-profile')}</MenuItem>
                                <MenuItem href={'#/' + Routes.logout.path}>{this.i18n('main.logout')}</MenuItem>
                            </NavDropdown>

                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>}
                <section className="container" style={{height: '100%'}}>
                    {this.props.children}
                </section>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MainView)));

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        isLoaded: state.auth.isLoaded,
        status: state.auth.status
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadUserProfile: bindActionCreators(loadUserProfile, dispatch)
    }
}