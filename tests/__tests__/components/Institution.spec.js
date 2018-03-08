'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import Institution from "../../../js/components/institution/Institution";

describe('Institution', function () {
    const intlData = require('../../../js/i18n/en');
    let institution,
        newInstitution,
        loading,
        institutionSaved,
        showAlert,
        institutionLoaded,
        admin,
        user,
        members = [],
        patients = [],
        handlers = {
            onSave: jasmine.createSpy('onSave'),
            onCancel: jasmine.createSpy('onCancel'),
            onChange: jasmine.createSpy('onChange'),
            onEditUser: jasmine.createSpy('onEditUser'),
            onAddNewUser: jasmine.createSpy('onAddNewUser'),
            onDelete: jasmine.createSpy('onDelete'),
        };

    beforeEach(() => {
        loading = false;
        showAlert = false;
        institutionLoaded = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        institutionSaved = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        newInstitution = {
            name: '',
            emailAddress: '',
            isNew: true
        };
    });

    user = {
        username: 'doctor',
        role: ROLE.DOCTOR
    };
    admin = {
        username: 'admin',
        role: ROLE.ADMIN
    };
    
    institution = {
        "name": "test",
        "emailAddress": "test@test.cz"
    };

    it('shows loader', function () {
        loading = true;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(result).not.toBeNull();
    });

    it('shows error about institution was not loaded', function () {
        institutionLoaded = {
            ...institutionLoaded,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it("renders institution's form empty", function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={newInstitution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(2);
        for(let input of result) {
            switch(input.name){
                case "name":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "email":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("email");
                    break;
            }
        }
    });

    it('renders "Save" button for admin and click on it', function () {
        newInstitution = {
            ...newInstitution,
            name: 'ahoj'
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={newInstitution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[0]); // save
        expect(handlers.onSave).toHaveBeenCalled();
    });

    it('does not render "Save" button for user', function () {
        newInstitution = {
            ...newInstitution,
            name: 'ahoj'
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={newInstitution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={user} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(1);
    });

    it('shows successful alert that institution was successfully saved', function () {
        showAlert = true;
        institutionSaved = {
            ...institutionSaved,
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('renders "Cancel" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} members={members}
                             patients={patients} loading={loading} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(3);

        TestUtils.Simulate.click(buttons[1]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });
});