'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import User from "../../../js/components/user/User";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import * as EntityFactory from "../../../js/utils/EntityFactory";
import enLang from '../../../js/i18n/en';

describe('User', function () {
    const intlData = enLang;
    let user,
        admin,
        newUser = EntityFactory.initNewUser(),
        institutions,
        backToInstitution,
        userSaved,
        showAlert,
        userLoaded,
        currentUser,
        currentUserAdmin,
        handlers = {
            onSave: jest.fn(),
            onCancel: jest.fn(),
            onChange: jest.fn(),
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
        ...newUser,
        password: 'test'
    };

    admin = {
        "uri": "http://onto.fel.cvut.cz/ontologies/record-manager/Admin-Administratorowitch",
        "firstName": "Test1",
        "lastName": "Man",
        "username": "testman1",
        "password": "test",
        "institution": {
            "uri": "http://test.io",
            "key": "823372507340798303",
            "name": "Test Institution",
            "emailAddress": "test@institution.io"
        },
        "types": [
            "http://onto.fel.cvut.cz/ontologies/record-manager/administrator",
            "http://onto.fel.cvut.cz/ontologies/record-manager/doctor"
        ]
    };

    user = {
        "uri": "http://onto.fel.cvut.cz/ontologies/record-manager/erter-tert",
        "firstName": "Test2",
        "lastName": "Man",
        "username": "testman2",
        "password": "test",
        "emailAddress": "test@man.io",
        "institution": {
            "key": 18691
        },
        "types": [
            "http://onto.fel.cvut.cz/ontologies/record-manager/doctor"
        ]
    };

    institutions = [{
        "uri": "http://test1.io",
        "key": "823372507340798303",
        "name": "Test1 Institution",
        "emailAddress": "test1@institution.io"
    }, {
        "uri": "http://test2.io",
        "key": "823372507340798301",
        "name": "Test2 Institution",
        "emailAddress": "test2@institution.io"
    }];

    beforeEach(() => {
        showAlert = false;
        userLoaded = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        userSaved = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
    });

    it('shows loader', function () {
        userLoaded = {
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={null} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
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
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it("renders user's form empty with random button", function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUserAdmin} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(result.length).toEqual(5);
        for (let input of result) {
            switch (input.name) {
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
        const selects = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'select');
        expect(selects.length).toEqual(2);
        expect(selects[1].value).toEqual(ROLE.DOCTOR);

        const randomButton = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'button-random');
        expect(randomButton.length).toEqual(1);
    });

    it('renders clickable "Save" button and click on it', function () {
        const newUserFilled = {
            ...newUser,
            username: 'test',
            firstName: 'test1',
            lastName: 'test2',
            emailAddress: 'test@test.cz',
            institution: {}
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUserFilled} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(3);

        expect(buttons[1].disabled).toBeFalsy();
        TestUtils.Simulate.click(buttons[1]); // save
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
                      userSaved={userSaved} showAlert={showAlert}
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
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders filled user\'s form without random button', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert} userLoaded={userLoaded}
                      currentUser={currentUserAdmin} institutions={institutions} impersonation={{}}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(result.length).toEqual(4);
        for (let input of result) {
            switch (input.name) {
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
            }
        }
        const selects = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'select');
        expect(selects.length).toEqual(2);
        expect(selects[0].disabled).toBeFalsy();
        expect(selects[1].disabled).toBeFalsy();

        const randomButton = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'glyphicon');
        expect(randomButton.length).toEqual(0);
    });

    it('renders filled admin\'s form', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={admin} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUserAdmin} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(result.length).toEqual(4);
        for (let input of result) {
            switch (input.name) {
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
            }
        }
        const selects = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'select');
        expect(selects.length).toEqual(2);
        expect(selects[1].value).toEqual(ROLE.ADMIN);
        expect(selects[0].disabled).toBeFalsy();
        expect(selects[1].disabled).toBeFalsy();
    });

    it('renders filled user\'s form', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={admin} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(result.length).toEqual(4);
        for (let input of result) {
            switch (input.name) {
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
            }
        }
        const selects = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'select');
        expect(selects.length).toEqual(1);
        expect(selects[0].value).toEqual(ROLE.ADMIN);
        expect(selects[0].disabled).toBeTruthy();
    });

    it('renders "Cancel" button and click on it', function () {
        const user = {
            ...newUser,
            username: 'test',
            firstName: 'test1',
            lastName: 'test2',
            emailAddress: 'test@test.cz',
            institution: {}
        };

        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(3);

        TestUtils.Simulate.click(buttons[2]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });

    it('renders "Back to institution" button and click on it', function () {
        const user = {
            ...newUser,
            username: 'test',
            firstName: 'test1',
            lastName: 'test2',
            emailAddress: 'test@test.cz',
            institution: {}
        };

        backToInstitution = true;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");

        expect(buttons.length).toEqual(3);

        TestUtils.Simulate.click(buttons[2]); // back to institution
        expect(handlers.onCancel).toHaveBeenCalled();
    });

    it('renders loading spinner in "Save" button on saving', function () {
        userSaved = {
            ...userSaved,
            status: ACTION_STATUS.PENDING
        };
        const user = {
            ...newUser,
            username: 'test',
            firstName: 'test1',
            lastName: 'test2',
            emailAddress: 'test@test.cz',
            institution: {}
        };

        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded} currentUser={currentUser} institutions={institutions}/>
            </IntlProvider>);
        const loader = TestUtils.findRenderedDOMComponentWithClass(tree, "loader");
        expect(loader).not.toBeNull();
    });
});