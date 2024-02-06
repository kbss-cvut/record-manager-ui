'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import Records from "../../../js/components/record/Records";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import enLang from '../../../js/i18n/en';
import {INITIAL_PAGE} from "../../../js/components/misc/Pagination";

describe('Records', function () {
    const intlData = enLang;
    let admin,
        records,
        recordsLoaded,
        recordDeleted,
        recordsDeleting = [],
        formTemplatesLoaded = {},
        showAlert,
        pagination,
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
        pagination = {
            pageNumber: INITIAL_PAGE,
            handlePagination: jest.fn(),
            itemCount: records.length,
            pageCount: 1
        };
        recordDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        handlers = {
            onEdit: jest.fn(),
            onCreate: jest.fn(),
            onDelete: jest.fn(),
            onExport: jest.fn()
        };

    });

    it('renders card with table and records', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} formTemplatesLoaded={formTemplatesLoaded}
                         recordDeleted={recordDeleted} handlers={handlers} pagination={pagination}
                         recordsDeleting={recordsDeleting} currentUser={admin}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(7);
    });

    it('renders "Create record" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} formTemplatesLoaded={formTemplatesLoaded}
                         recordDeleted={recordDeleted} handlers={handlers} pagination={pagination}
                         recordsDeleting={recordsDeleting} currentUser={admin}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        const createButton = buttons.find(b => b.id === "records-create");
        expect(createButton).toBeDefined();

        TestUtils.Simulate.click(createButton); // Create record
        expect(handlers.onCreate).toHaveBeenCalled();
    });
});