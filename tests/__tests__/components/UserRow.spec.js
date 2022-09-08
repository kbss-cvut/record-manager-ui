'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import UserRow from "../../../js/components/user/UserRow";
import enLang from '../../../js/i18n/en';

describe('UserRow', function () {
    const intlData = enLang;
    let user,
        deletionLoading = false,
        onEdit = jest.fn(),
        onDelete = jest.fn();

    user = {
        "uri": "http://onto.fel.cvut.cz/ontologies/record-manager/Admin-Administratorowitch",
        "firstName": "Test1",
        "lastName": "Man",
        "username": "testman1",
        "emailAddress": "test@man.io",
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

    it('renders one row of table with 5 columns and 2 buttons and 1 link button', function () {
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
        expect(buttons.length).toEqual(3);
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
        expect(buttons.length).toEqual(3);

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

        const buttons = TestUtils.scryRenderedDOMComponentsWithClass(tree, "btn-link");
        expect(buttons.length).toBe(1);

        TestUtils.Simulate.click(buttons[0]);
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
        expect(buttons.length).toEqual(3);

        TestUtils.Simulate.click(buttons[2]); // Delete User
        expect(onDelete).toHaveBeenCalled();
    });
});