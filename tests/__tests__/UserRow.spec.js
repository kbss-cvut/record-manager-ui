'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import UserRow from "../../js/components/user/UserRow";

describe('Testing UserRow component', function () {
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

    it('is correctly rendered ', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
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

    it('should go to user profile by button click', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
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

    it('should go to user profile by name click', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
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

    it('should click on user delete', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en">
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