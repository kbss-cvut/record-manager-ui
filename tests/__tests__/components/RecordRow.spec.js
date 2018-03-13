'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import RecordRow from "../../../js/components/record/RecordRow";

describe('RecordRow', function () {
    const intlData = require('../../../js/i18n/en');
    let record,
        deletionLoading = false,
        onEdit = jasmine.createSpy('onEdit'),
        onDelete = jasmine.createSpy('onDelete');

    record = {
        "uri":"http://vfn.cz/ontologies/study-manager/patient-record#instance456619208",
        "key":"159968282553298775",
        "localName":"Test2",
        "dateCreated":"1520956570035",
        "author": {username: 'test'},
        "institution": {key: 12345678}
    };

    it('renders one row of table with 5 columns and 2 buttons', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <RecordRow record={record} onEdit={onEdit} onDelete={onDelete}
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
                    <RecordRow record={record} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[0]); // Open Record
        expect(onEdit).toHaveBeenCalled();
    });

    it('renders id and patients identifier with links and click on one', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <RecordRow record={record} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);

        const links = TestUtils.scryRenderedDOMComponentsWithTag(tree, "a");
        expect(links.length).toEqual(2);

        TestUtils.Simulate.click(links[0]);
        expect(onEdit).toHaveBeenCalled();
    });

    it('renders "Delete" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <RecordRow record={record} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // Delete Record
        expect(onDelete).toHaveBeenCalled();
    });
});