'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import Users from "../../../js/components/user/Users";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import enLang from '../../../js/i18n/en';

describe('Users', function () {
    const intlData = enLang;
    let users,
        usersLoaded,
        usersLoadedEmpty,
        userDeleted,
        showAlert,
        handlers;

    users = [{
        "username": "testman1"
    }, {
        "username": "testman2"
    }];

    beforeEach(() => {
        showAlert = false;
        userDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        handlers = {
            onEdit: jasmine.createSpy('onEdit'),
            onCreate: jasmine.createSpy('onCreate'),
            onDelete: jasmine.createSpy('onDelete')
        };
        usersLoaded = {
            status: ACTION_STATUS.SUCCESS,
            users
        };
        usersLoadedEmpty = {
            status: ACTION_STATUS.SUCCESS,
            users: []
        };
    });

    it('shows loader', function () {
        usersLoaded = {
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoaded} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(result).not.toBeNull();
    });

    it('shows error about institutions were not loaded', function () {
        usersLoaded = {
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoaded} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders card with text, that no users were found', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoadedEmpty} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const text = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p');
        expect(text.length).toEqual(1);
    });

    it('renders card with table and table headers', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoaded} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'th');
        expect(th.length).toEqual(5);
    });

    it('renders "Create user" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoaded} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(7);

        TestUtils.Simulate.click(buttons[6]); // Create User
        expect(handlers.onCreate).toHaveBeenCalled();
    });

    it('shows successful alert that user was successfully deleted', function () {
        showAlert = true;
        userDeleted = {
            ...userDeleted,
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoaded} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('shows unsuccessful alert that user was not deleted', function () {
        showAlert = true;
        userDeleted = {
            ...userDeleted,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users usersLoaded={usersLoaded} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});