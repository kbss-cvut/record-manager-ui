'use strict';

import React from "react";
import * as I18nStore from "../stores/I18nStore";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import * as Constants from "../constants/Constants";
import * as Routes from "../utils/Routes";
import * as Authentication from "../utils/Authentication";
import {injectIntl} from "react-intl";
import I18nWrapper from "../i18n/I18nWrapper";
import {loadCurrentUser, loadUserProfile, logout} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_STATUS, ROLE} from "../constants/DefaultConstants";
import Mask from "./Mask";

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
        if (!this.props.status || this.props.status === ACTION_STATUS.PENDING) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        /*TODO promyslet authenticated*/
        if (!this.props.isLoaded) {
            return (<div>{this.props.children}</div>);
        }
        const user = this.props.user;
        const name = user.firstName.substr(0, 1) + '. ' + user.lastName;
        return (
            <div>
                <header>
                    <Navbar>
                        <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">{Constants.APP_NAME}</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                        <Nav pullLeft>
                            <LinkContainer
                                to='dashboard'><NavItem>{this.i18n('main.dashboard-nav')}</NavItem></LinkContainer>
                        {this._renderUsers()}
                            {this.props.user.role === ROLE.ADMIN ?
                                <LinkContainer to='institutions'>
                                    <NavItem>{this.i18n('main.institutions-nav')}</NavItem>
                                </LinkContainer>
                                : <LinkContainer to={{ pathname: '/institutions/'+user.institution.key}}>
                                    <NavItem>{this.i18n('main.institution-nav')}</NavItem>
                                </LinkContainer>
                            }
                            <LinkContainer
                                to='records'><NavItem>{this.i18n('main.records-nav')}</NavItem></LinkContainer>
                        </Nav>

                            <Nav pullRight>
                            <NavDropdown id='logout' title={name}>
                                <MenuItem
                                    href={'#/' + Routes.users.path + '/' + user.username}>{this.i18n('main.my-profile')}</MenuItem>
                                <MenuItem href='#' onClick={this.props.logout}>{this.i18n('main.logout')}</MenuItem>
                            </NavDropdown>

                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
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
        loadUserProfile: bindActionCreators(loadUserProfile, dispatch),
        logout: bindActionCreators(logout, dispatch)
    }
}