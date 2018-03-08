'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import Users from "../../../js/components/user/Users";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";

describe('Users', function () {
    const intlData = require('../../../js/i18n/en');
    let users,
        userDeleted,
        showAlert,
        handlers,
        status;

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
    });

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

    it('is showing loader', function () {
        status = ACTION_STATUS.PENDING;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users users={[]} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers} status={status}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(result).not.toBeNull();
    });

    it('should render panel with table and table headers', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
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

   it('should render "Create user" button and click on it', function () {
       const tree = TestUtils.renderIntoDocument(
           <IntlProvider locale="en" {...intlData}>
               <Users users={users} showAlert={showAlert}
                      userDeleted={userDeleted} handlers={handlers}/>
           </IntlProvider>);
       const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
       expect(buttons.length).toEqual(5);

       TestUtils.Simulate.click(buttons[4]); // Create User
       expect(handlers.onCreate).toHaveBeenCalled();
   });

    it('should show successful alert that user was successfully deleted', function () {
        showAlert = true;
        userDeleted = {
            ...userDeleted,
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Users users={users} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('should show unsuccessful alert that user was not deleted', function () {
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
                <Users users={users} showAlert={showAlert}
                       userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});