'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import Records from "../../../js/components/record/Records";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import enLang from '../../../js/i18n/en';

describe('Records', function () {
    const intlData = enLang;
    let admin,
        records,
        recordsLoaded,
        recordDeleted,
        recordsDeleting = [],
        formTemplatesLoaded = {},
        showAlert,
        handlers;
    admin = {
        username: 'admin',
        role: ROLE.ADMIN
    };
    records = [{
        "uri":"http://onto.fel.cvut.cz/ontologies/record-manager/patient-record#instance456619209",
        "key":"159968282553298774",
        "localName":"Test1",
        "dateCreated":"1520956570034",
        "author": {username: 'test'},
        "institution": {key: 12345678}
    }, {
        "uri":"http://onto.fel.cvut.cz/ontologies/record-manager/patient-record#instance456619208",
        "key":"159968282553298775",
        "localName":"Test2",
        "dateCreated":"1520956570035",
        "author": {username: 'test'},
        "institution": {key: 12345678}
    }];

    beforeEach(() => {
        showAlert = false;
        recordsLoaded = {
            status: ACTION_STATUS.SUCCESS,
            records
        };
        recordDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        handlers = {
            onEdit: jest.fn(),
            onCreate: jest.fn(),
            onDelete: jest.fn()
        };

    });

    xit('renders card with table and records', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}
                         recordsDeleting={recordsDeleting} currentUser={admin}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(5);
    });

    xit('renders "Create record" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}
                         recordsDeleting={recordsDeleting} currentUser={admin}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(9);

        TestUtils.Simulate.click(buttons[8]); // Create record
        expect(handlers.onCreate).toHaveBeenCalled();
    });

    xit('renders successful alert that record was successfully deleted', function () {
        showAlert = true;
        recordDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}
                         recordsDeleting={recordsDeleting} currentUser={admin}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('renders unsuccessful alert that record was not deleted', function () {
        showAlert = true;
        recordDeleted = {
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}
                         recordsDeleting={recordsDeleting} currentUser={admin}
                         formTemplatesLoaded={formTemplatesLoaded}
                />
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});