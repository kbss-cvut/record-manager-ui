'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import Institution from "../../../js/components/institution/Institution";
import enLang from '../../../js/i18n/en';

describe('Institution', function () {
    const intlData = enLang;
    let institution,
        newInstitution,
        institutionSaved,
        showAlert,
        institutionLoaded,
        admin,
        user,
        institutionMembers = {},
        recordsLoaded = {
        records: []
        },
        formTemplatesLoaded = {},
        handlers = {
            onSave: jest.fn(),
            onCancel: jest.fn(),
            onChange: jest.fn(),
            onEditUser: jest.fn(),
            onAddNewUser: jest.fn(),
            onDelete: jest.fn(),
            onEditPatient: jest.fn(),
            onExportRecords: jest.fn()
        };

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

    institutionMembers = {
        status: ACTION_STATUS.SUCCESS,
        members: {}
    };

    beforeEach(() => {
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
        recordsLoaded = {
            status: ACTION_STATUS.SUCCESS,
            records: []
        };
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
                <Institution handlers={handlers} institution={institution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it("renders institution's form empty", function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={newInstitution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(2);
        for(let input of result) {
            switch(input.name){
                case "localName":
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
                <Institution handlers={handlers} institution={newInstitution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
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
                <Institution handlers={handlers} institution={newInstitution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
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
                <Institution handlers={handlers} institution={institution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('renders "Cancel" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(3);

        TestUtils.Simulate.click(buttons[1]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });

    it('shows unsuccessful alert that institution was not saved', function () {
        showAlert = true;
        institutionSaved = {
            ...institutionSaved,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders loading spinner in "Save" button on saving', function () {
        institutionSaved = {
            ...institutionSaved,
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institution handlers={handlers} institution={institution} institutionMembers={institutionMembers}
                             recordsLoaded={recordsLoaded}  formTemplatesLoaded={formTemplatesLoaded} showAlert={showAlert}
                             currentUser={admin} institutionLoaded={institutionLoaded}
                             institutionSaved={institutionSaved}/>
            </IntlProvider>);
        const loader = TestUtils.findRenderedDOMComponentWithClass(tree, "loader");
        expect(loader).not.toBeNull();
    });
});