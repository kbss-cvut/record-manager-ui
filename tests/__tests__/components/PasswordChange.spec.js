'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import User from "../../../js/components/user/User";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import PasswordChange from "../../../js/components/user/PasswordChange";

describe('PasswordChange', function () {
    const intlData = require('../../../js/i18n/en');
    let valid,
        paramsUser,
        passwordChange,
        showAlert,
        currentUser,
        currentUserAdmin,
        handlers;

    beforeEach(() => {
        handlers = {
            onSave: jasmine.createSpy('onSave'),
            onCancel: jasmine.createSpy('onCancel'),
            onChange: jasmine.createSpy('onChange'),
        };
        valid = true;
        showAlert = false;
    });

    currentUser = {
        username: 'testUser',
        role: ROLE.DOCTOR
    };
    currentUserAdmin = {
        username: 'testAdmin',
        role: ROLE.ADMIN
    };

    paramsUser = {
        username: currentUser.username
    };

    it('shows error about password was not changed', function () {
        showAlert = true;
        passwordChange = {
            status: ACTION_STATUS.ERROR,
            error: {
                message: "error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        const alert = TestUtils.findRenderedDOMComponentWithClass(tree, 'alert-danger');
        expect(alert).not.toBeNull();
    });

    it("shows alert that password was successfully changed", function () {
        showAlert = true;
        passwordChange = {
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        const alert = TestUtils.findRenderedDOMComponentWithClass(tree, 'alert-success');
        expect(alert).not.toBeNull();
    });

    it('should render "Save" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[0]); // save
        expect(handlers.onSave).toHaveBeenCalled();
    });


    it('shows alert that password is not valid', function () {
        showAlert = true;
        valid = false;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        const alert = TestUtils.findRenderedDOMComponentWithClass(tree, 'alert-danger');
        expect(alert).not.toBeNull();
    });

    it('renders 2 inputs for admin who is changing password to someone else', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUserAdmin} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(inputs.length).toEqual(2);
    });

    it('renders 3 inputs when somebody is changing his password', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(inputs.length).toEqual(3);
    });

    it('should render "Cancel" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });
});