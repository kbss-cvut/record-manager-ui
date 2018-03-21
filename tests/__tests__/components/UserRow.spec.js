'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import UserRow from "../../../js/components/user/UserRow";

describe('UserRow', function () {
    const intlData = require('../../../js/i18n/en');
    let user,
        deletionLoading = false,
        onEdit = jasmine.createSpy('onEdit'),
        onDelete = jasmine.createSpy('onDelete');

    user = {
        "uri":"http://vfn.cz/ontologies/study-manager/Admin-Administratorowitch",
        "firstName":"Test1",
        "lastName":"Man",
        "username":"testman1",
        "emailAddress":"test@man.io",
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

    it('renders one row of table with 5 columns and 2 buttons', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                        <UserRow user={user} onEdit={onEdit} onDelete={onDelete}
                         deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const td = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'td');
        expect(td.length).toEqual(5);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'Button');
        expect(buttons.length).toEqual(2);
    });

    it('renders "Open" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <UserRow user={user} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[0]); // Open User
        expect(onEdit).toHaveBeenCalled();
    });

    it('renders name with link and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <UserRow user={user} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);

        const link = TestUtils.findRenderedDOMComponentWithTag(tree, "a");
        expect(link).not.toBeNull();

        TestUtils.Simulate.click(link);
        expect(onEdit).toHaveBeenCalled();
    });

    it('renders "Delete" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <UserRow user={user} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // Delete User
        expect(onDelete).toHaveBeenCalled();
    });
});