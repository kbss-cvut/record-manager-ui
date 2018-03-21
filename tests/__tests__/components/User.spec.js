'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import User from "../../../js/components/user/User";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";

describe('User', function () {
    const intlData = require('../../../js/i18n/en');
    let user,
        admin,
        newUser,
        institutions,
        backToInstitution,
        loading,
        userSaved,
        showAlert,
        userLoaded,
        currentUser,
        currentUserAdmin,
        handlers = {
            onSave: jasmine.createSpy('onSave'),
            onCancel: jasmine.createSpy('onCancel'),
            onChange: jasmine.createSpy('onChange'),
        };

    beforeEach(() => {
        loading = false;
        showAlert = false;
        userLoaded = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        userSaved = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        currentUser = {
            username: 'test',
            role: ROLE.DOCTOR
        };
        currentUserAdmin = {
            username: 'test',
            role: ROLE.ADMIN
        };
        newUser = {
            firstName: '',
            lastName: '',
            username: '',
            emailAddress: '',
            password: 'test',
            isAdmin: false,
            isNew: true
        };
    });


    admin = {
        "uri":"http://vfn.cz/ontologies/study-manager/Admin-Administratorowitch",
        "firstName":"Test1",
        "lastName":"Man",
        "username":"testman1",
        "password":"test",
        "institution":{
            "uri":"http://test.io",
            "key":"823372507340798303",
            "name":"Test Institution",
            "emailAddress":"test@institution.io"
        },
        "types":[
            "http://vfn.cz/ontologies/study-manager/administrator",
            "http://vfn.cz/ontologies/study-manager/doctor"
        ]
    };

    user = {
        "uri":"http://vfn.cz/ontologies/study-manager/erter-tert",
        "firstName":"Test2",
        "lastName":"Man",
        "username":"testman2",
        "password": "test",
        "emailAddress":"test@man.io",
        "types":[
            "http://vfn.cz/ontologies/study-manager/doctor"
        ]
    };

    institutions = [{
        "uri":"http://test1.io",
        "key":"823372507340798303",
        "name":"Test1 Institution",
        "emailAddress":"test1@institution.io"
    }, {
        "uri":"http://test2.io",
        "key":"823372507340798301",
        "name":"Test2 Institution",
        "emailAddress":"test2@institution.io"
    }];

    it('is showing loader', function () {
        loading = true;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(result).not.toBeNull();
    });

    it('shows error about user was not loaded', function () {
        userLoaded = {
            ...userLoaded,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
    const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
    expect(alert).not.toBeNull();
    });

    it("renders user's form empty", function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUserAdmin} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(6);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
            }
        }
        const select = TestUtils.findRenderedDOMComponentWithTag(tree,'select');
        expect(select).not.toBeNull();
    });

    it('renders clickable "Save" button and click on it', function () {
        newUser = {
            ...newUser,
            username: 'test',
            firstName: 'test1',
            lastName: 'test2'
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        expect(buttons[0].disabled).toBeFalsy();
        TestUtils.Simulate.click(buttons[0]); // save
        expect(handlers.onSave).toHaveBeenCalled();
    });


    it('shows successful alert that user was successfully saved', function () {
        showAlert = true;
        userSaved = {
            ...userSaved,
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('shows unsuccessful alert that user was not saved', function () {
        showAlert = true;
        userSaved = {
            ...userSaved,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders filled user\'s form without checked administrator checkbox', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUserAdmin} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(6);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("Test2");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("Man");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("testman2");
                    expect(input.type).toEqual("text");
                    expect(input.disabled).toBeTruthy();
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("test@man.io");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
                default:
                    expect(input.type).toEqual("checkbox");
                    expect(input.checked).toBeFalsy();
            }
        }
        const select = TestUtils.findRenderedDOMComponentWithTag(tree,'select');
        expect(select).not.toBeNull();
    });

    it('renders filled user\'s form with checked administrator checkbox', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={admin} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUserAdmin} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(6);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("Test1");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("Man");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("testman1");
                    expect(input.type).toEqual("text");
                    expect(input.disabled).toBeTruthy();
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
                default:
                    expect(input.type).toEqual("checkbox");
                    expect(input.checked).toBeTruthy();
            }
        }
        const select = TestUtils.findRenderedDOMComponentWithTag(tree,'select');
        expect(select).not.toBeNull();
    });

    it('renders filled user\'s form without checkbox and selectbox', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={admin} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(5);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("Test1");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("Man");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("testman1");
                    expect(input.type).toEqual("text");
                    expect(input.disabled).toBeTruthy();
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
            }
        }
        const select = TestUtils.scryRenderedDOMComponentsWithTag(tree,'select');
        expect(select.length).toEqual(0);
    });

    it('renders "Cancel" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });

    it('renders "Back to institution" button and click on it', function () {
        backToInstitution = true;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // back to institution
        expect(handlers.onCancel).toHaveBeenCalled();
    });

    it('renders loading spinner in "Save" button on saving', function () {
        userSaved = {
            ...userSaved,
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const loader = TestUtils.findRenderedDOMComponentWithClass(tree, "loader");
        expect(loader).not.toBeNull();
    });
});