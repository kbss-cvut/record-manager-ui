'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import InstitutionRow from "../../../js/components/institution/InstitutionRow";

describe('InstitutionRow', function () {
    const intlData = require('../../../js/i18n/en');
    let institution,
        deletionLoading = false,
        onEdit = jasmine.createSpy('onEdit'),
        onDelete = jasmine.createSpy('onDelete');

    institution = {
        "uri":"http://test.io",
        "key":"823372507340798303",
        "name":"Test Institution",
        "emailAddress":"test@institution.io"
    };

    it('renders one row of table with 3 columns and 2 buttons', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <InstitutionRow institution={institution} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const td = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'td');
        expect(td.length).toEqual(3);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'Button');
        expect(buttons.length).toEqual(2);
    });

    it('renders "Open" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <InstitutionRow institution={institution} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[0]); // Open Institution
        expect(onEdit).toHaveBeenCalled();
    });

    it('renders name with link and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                    <InstitutionRow institution={institution} onEdit={onEdit} onDelete={onDelete}
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
                    <InstitutionRow institution={institution} onEdit={onEdit} onDelete={onDelete}
                             deletionLoading={deletionLoading}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // Delete Institution
        expect(onDelete).toHaveBeenCalled();
    });
});