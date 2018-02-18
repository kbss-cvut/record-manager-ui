'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import Users from "../../js/components/user/Users";

describe('Testing Users component', function () {
    let users,
        userDeleted = {
            fetching: false
        },
        showAlert = false,
        handlers = {
            onEdit: jasmine.createSpy('onEdit'),
            onCreate: jasmine.createSpy('onCreate'),
            onDelete: jasmine.createSpy('onDelete'),
            onBackToInstitution: null
        };

    users = [{
        "uri":"http://vfn.cz/ontologies/study-manager/Admin-Administratorowitch",
        "firstName":"Test1",
        "lastName":"Man",
        "username":"testman1",
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
    }, {
        "uri":"http://vfn.cz/ontologies/study-manager/erter-tert",
        "firstName":"Test2",
        "lastName":"Man",
        "username":"testman2",
        "emailAddress":"test@man.io",
        "types":[
            "http://vfn.cz/ontologies/study-manager/doctor"
        ]
    }];

    it('is loading', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
                <Users users={[]} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(result).not.toBeNull();
    });

    it('is correctly rendered ', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
                <Users users={users} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const panelHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel');
        expect(panelHeading).not.toBeNull();
        const panelBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel-body');
        expect(panelBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(5);
    });

   it('should go to user creation', function () {
       const tree = TestUtils.renderIntoDocument(
           <IntlProvider locale="en">
               <Users users={users} showAlert={showAlert}
                      userDeleted={userDeleted} handlers={handlers}/>
           </IntlProvider>);
       const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
       expect(buttons.length).toEqual(5);

       TestUtils.Simulate.click(buttons[4]); // Create User
       expect(handlers.onCreate).toHaveBeenCalled();
   });

    it('should go back to institution ', function () {
        handlers = {
            ...handlers,
            onBackToInstitution: jasmine.createSpy('onBackToInstitution')
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
                <Users users={users} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(6);

        TestUtils.Simulate.click(buttons[5]);
        expect(handlers.onBackToInstitution).toHaveBeenCalled();
    });

    it('should show success alert about user deletion', function () {
        userDeleted = {
            ...userDeleted,
            success: true
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
                <Users users={users} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('should show error alert about user deletion', function () {
        userDeleted = {
            ...userDeleted,
            success: false,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
                <Users users={users} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});