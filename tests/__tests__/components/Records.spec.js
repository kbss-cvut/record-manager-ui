'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import Records from "../../../js/components/record/Records";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";

describe('Records', function () {
    const intlData = require('../../../js/i18n/en');
    let records,
        recordsLoaded,
        recordDeleted,
        showAlert,
        handlers;
    
    records = [{
        "uri":"http://vfn.cz/ontologies/study-manager/patient-record#instance456619209",
        "key":"159968282553298774",
        "localName":"Test1",
        "dateCreated":"1520956570034",
        "author": {username: 'test'},
        "institution": {key: 12345678}
    }, {
        "uri":"http://vfn.cz/ontologies/study-manager/patient-record#instance456619208",
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
            onEdit: jasmine.createSpy('onEdit'),
            onCreate: jasmine.createSpy('onCreate'),
            onDelete: jasmine.createSpy('onDelete')
        };

    });

    it('renders panel with table and records', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}/>
            </IntlProvider>);
        const panelHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel');
        expect(panelHeading).not.toBeNull();
        const panelBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel-body');
        expect(panelBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(5);
    });

    it('renders "Create record" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(5);

        TestUtils.Simulate.click(buttons[4]); // Create record
        expect(handlers.onCreate).toHaveBeenCalled();
    });

    it('renders successful alert that record was successfully deleted', function () {
        showAlert = true;
        recordDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Records recordsLoaded={recordsLoaded} showAlert={showAlert}
                         recordDeleted={recordDeleted} handlers={handlers}/>
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
                         recordDeleted={recordDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});