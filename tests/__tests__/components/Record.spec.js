'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import Record from "../../../js/components/record/Record";
import * as RecordState from "../../../js/model/RecordState";

describe('Record', function () {
    const intlData = require('../../../js/i18n/en');
    let record,
        newRecord,
        recordSaved,
        showAlert,
        recordLoaded,
        formgen = {},
        handlers = {
            onSave: jasmine.createSpy('onSave'),
            onCancel: jasmine.createSpy('onCancel'),
            onChange: jasmine.createSpy('onChange'),
            onEditUser: jasmine.createSpy('onEditUser'),
            onAddNewUser: jasmine.createSpy('onAddNewUser'),
            onDelete: jasmine.createSpy('onDelete'),
        };

    beforeEach(() => {
        showAlert = false;
        recordLoaded = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        recordSaved = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        newRecord = {
            localName: '',
            complete: false,
            isNew: true,
            state: RecordState.createInitialState()
        };
    });

    record = {
        author: {firstName: 'test', lastName: 'test'},
        institution: {localName: 'testInstitution'},
        dateCreated: 1521225180115,
        key: '640579951330382351',
        localName: 'test',
        lastModified: 1521277544192,
        state: RecordState.createRecordState()
    };

    it('shows loader', function () {
        recordLoaded = {
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={null} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(result).not.toBeNull();
    });

    it('shows error about record was not loaded', function () {
        recordLoaded = {
            ...recordLoaded,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={record} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it("renders record's form empty", function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={newRecord} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(1);
        for(let input of result) {
            switch(input.name){
                case "localName":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
            }
        }
    });

    it('renders "Save" and "Cancel" buttons', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={newRecord} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);
    });

    it('shows successful alert that record was successfully saved', function () {
        showAlert = true;
        recordSaved = {
            ...recordSaved,
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={newRecord} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('shows unsuccessful alert that record was not saved', function () {
        showAlert = true;
        recordSaved = {
            ...recordSaved,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={newRecord} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders loading spinner in "Save" button on saving', function () {
        recordSaved = {
            ...recordSaved,
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Record ref={null} handlers={handlers} record={newRecord} recordLoaded={recordLoaded}
                        recordSaved={recordSaved} showAlert={showAlert} formgen={formgen}/>
            </IntlProvider>);
        const loader = TestUtils.findRenderedDOMComponentWithClass(tree, "loader");
        expect(loader).not.toBeNull();
    });
});