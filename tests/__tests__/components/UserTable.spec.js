'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import UserTable from "../../../js/components/user/UserTable";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import enLang from '../../../js/i18n/en';

describe('UserTable', function () {
    const intlData = enLang;
    let users,
        userDeleted = {
            status: ACTION_STATUS.SUCCESS
        },
        handlers = {
            onEdit: jest.fn(),
            onCreate: jest.fn(),
            onDelete: jest.fn()
        };

    users = [{
        "uri":"http://onto.fel.cvut.cz/ontologies/record-manager/erter-tert",
        "firstName":"Test2",
        "lastName":"Man",
        "username":"testman2",
        "emailAddress":"test@man.io",
        "types":[
            "http://onto.fel.cvut.cz/ontologies/record-manager/doctor"
        ]
    }];

    it('renders table with 5 headers columns', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <UserTable users={users} userDeleted={userDeleted} handlers={handlers}/>
            </IntlProvider>);
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(5);
    });

    it('renders modal window by "Delete" button click', function () {
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
