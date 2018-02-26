'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import UserTable from "../../js/components/user/UserTable";
import {ACTION_STATUS} from "../../js/constants/DefaultConstants";

describe('Testing UserTable component', function () {
    const intlData = require('../../js/i18n/en');
    let users,
        userDeleted = {
            status: ACTION_STATUS.SUCCESS
        },
        handlers = {
            onEdit: jasmine.createSpy('onEdit'),
            onCreate: jasmine.createSpy('onCreate'),
            onDelete: jasmine.createSpy('onDelete')
        };

    users = [{
        "uri":"http://vfn.cz/ontologies/study-manager/erter-tert",
        "firstName":"Test2",
        "lastName":"Man",
        "username":"testman2",
        "emailAddress":"test@man.io",
        "types":[
            "http://vfn.cz/ontologies/study-manager/doctor"
        ]
    }];

    it('is correctly rendered ', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <UserTable users={users} userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(5);
    });

    it('should render modal on delete button click', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <UserTable users={users} userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        TestUtils.Simulate.click(buttons[1]); // Delete User
        const modal = TestUtils.scryRenderedDOMComponentsWithClass(tree, "modal-dialog");
        expect(modal).not.toBeNull();
    });
});
