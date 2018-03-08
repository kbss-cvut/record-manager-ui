import TestUtils from "react-addons-test-utils";
import React from "react";
import {IntlProvider} from "react-intl";
import RecordTable from "../../../js/components/record/RecordTable";

describe('RecordTable', function () {
    const intlData = require('../../../js/i18n/en');
    let patients,
        handlers = {onEdit: jasmine.createSpy('onEdit')},
        disableDelete = true;

    patients = [
        {
            key: 4324344
        },
        {
            key: 4321434
        }
    ];

    it('renders table with headers and columns', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordTable records={patients} handlers={handlers} disableDelete={disableDelete}/>
            </IntlProvider>);
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(5);
        const td = TestUtils.scryRenderedDOMComponentsWithTag(tree,'td');
        expect(td.length).toEqual(10);
    });

    it('renders "Open" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordTable records={patients} handlers={handlers} disableDelete={disableDelete}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);
        TestUtils.Simulate.click(buttons[0]); // open
        expect(handlers.onEdit).toHaveBeenCalled();
    });
});