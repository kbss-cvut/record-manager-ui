'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import User from "../../../js/components/user/User";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import PasswordChange from "../../../js/components/user/PasswordChange";
import * as UserFactory from "../../../js/utils/EntityFactory";
import enLang from '../../../js/i18n/en';

describe('PasswordChange', function () {
    const intlData = enLang;
    let valid,
        paramsUser,
        passwordChange,
        showAlert,
        currentUser,
        currentUserAdmin,
        handlers,
        passwordEmpty,
        passwordFilled;

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

    passwordEmpty = UserFactory.initNewPassword();
    passwordFilled = {
        currentPassword: 'aaaa',
        newPassword: 'aaaa',
        confirmPassword: 'aaaa'
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
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
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
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
            </IntlProvider>);
        const alert = TestUtils.findRenderedDOMComponentWithClass(tree, 'alert-success');
        expect(alert).not.toBeNull();
    });

    it('renders clickable "Save" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordFilled}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        expect(buttons[0].disabled).toBeFalsy();
        TestUtils.Simulate.click(buttons[0]); // save
        expect(handlers.onSave).toHaveBeenCalled();
    });

    it('renders disabled "Save" button', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        expect(buttons[0].disabled).toBeTruthy();
    });

    it('shows alert that password is not valid', function () {
        showAlert = true;
        valid = false;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
            </IntlProvider>);
        const alert = TestUtils.findRenderedDOMComponentWithClass(tree, 'alert-danger');
        expect(alert).not.toBeNull();
    });

    it('renders 2 inputs for admin who is changing password to someone else', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUserAdmin} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
            </IntlProvider>);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(inputs.length).toEqual(2);
    });

    it('renders 3 inputs when somebody is changing his password', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
            </IntlProvider>);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(inputs.length).toEqual(3);
    });

    it('renders "Cancel" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={showAlert}
                                valid={valid} passwordChange={passwordChange} params={paramsUser} password={passwordEmpty}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });
});