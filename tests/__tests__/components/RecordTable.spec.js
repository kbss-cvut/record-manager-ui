import TestUtils from "react-addons-test-utils";
import React from "react";
import {IntlProvider} from "react-intl";
import RecordTable from "../../../js/components/record/RecordTable";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import enLang from '../../../js/i18n/en';

describe('RecordTable', function () {
    const intlData = enLang;
    let records,
        recordsLoaded,
        recordDeleted = {status: ACTION_STATUS.SUCCESS},
        handlers = {onEdit: jasmine.createSpy('onEdit')},
        disableDelete = true;

    records = [
        {
            key: 4324344
        },
        {
            key: 4321434
        }
    ];

    beforeEach(() => {
        recordsLoaded = {
            status: ACTION_STATUS.SUCCESS,
            records
        }
    });

    it('shows loader', function () {
        recordsLoaded = {
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordTable recordsLoaded={recordsLoaded} handlers={handlers} disableDelete={disableDelete}
                             recordDeleted={recordDeleted}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(result).not.toBeNull();
    });

    it('renders unsuccessful alert that records were not loaded', function () {
        recordsLoaded = {
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordTable recordsLoaded={recordsLoaded} handlers={handlers} disableDelete={disableDelete}
                             recordDeleted={recordDeleted}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders table with headers and columns', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordTable recordsLoaded={recordsLoaded} handlers={handlers} disableDelete={disableDelete}
                             recordDeleted={recordDeleted}/>
            </IntlProvider>);
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'th');
        expect(th.length).toEqual(5);
        const td = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'td');
        expect(td.length).toEqual(10);
    });

    it('renders "Open" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordTable recordsLoaded={recordsLoaded} handlers={handlers} disableDelete={disableDelete}
                             recordDeleted={recordDeleted}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);
        TestUtils.Simulate.click(buttons[0]); // open
        expect(handlers.onEdit).toHaveBeenCalled();
    });
});