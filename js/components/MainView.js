'use strict';

import React from "react";
import UserStore from '../stores/UserStore';
import * as I18nStore from "../stores/I18nStore";
import {MenuItem, Nav, Navbar, NavbarBrand, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import * as Constants from "../constants/Constants";
import * as Routes from "../utils/Routes";
import * as Authentication from "../utils/Authentication";
import {injectIntl} from "react-intl";
import I18nWrapper from "../i18n/I18nWrapper";
import Actions from "../actions/Actions";

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            loggedIn: UserStore.isLoaded()
        };
    }

    componentWillMount() {
        I18nStore.setIntl(this.props.intl);
        this.unsubscribe = UserStore.listen(this.onUserLoaded);
    }

    onUserLoaded = (data) => {
        if (data.action === Actions.loadCurrentUser) {
            this.setState({loggedIn: true});
        }
    };

    _renderUsers() {
        return Authentication.isAdmin() ?
                <LinkContainer to='users'><NavItem>{this.i18n('main.users-nav')}</NavItem></LinkContainer>
            : null;
    }

    render() {
        if (!this.state.loggedIn) {
            return (<div>{this.props.children}</div>);
        }
        const user = UserStore.getCurrentUser();
        const name = user.firstName.substr(0, 1) + '. ' + user.lastName;
        return (
            <div>
                <header>
                    <Navbar>
                        <Navbar.Header>
                        <Navbar.Brand>{Constants.APP_NAME}</Navbar.Brand>
                        <Navbar.Toggle />
                        </Navbar.Header>

                        <Navbar.Collapse>
                        <Nav pullLeft>
                            <LinkContainer
                                to='dashboard'><NavItem>{this.i18n('main.dashboard-nav')}</NavItem></LinkContainer>
                        {this._renderUsers()}
                            {Authentication.isAdmin() ?
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
                                <MenuItem href='#' onClick={Authentication.logout}>{this.i18n('main.logout')}</MenuItem>
                            </NavDropdown>

                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
                <section style={{height: '100%'}}>
                    {this.props.children}
                </section>
            </div>
        );
    }
}

export default injectIntl(I18nWrapper(MainView));
