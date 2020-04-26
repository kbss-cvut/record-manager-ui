'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import Institutions from "../../../js/components/institution/Institutions";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import enLang from '../../../js/i18n/en';

describe('Institutions', function () {
    const intlData = enLang;
    let institutionsLoaded,
        institutionsLoadedEmpty,
        institutionDeleted,
        institutions,
        showAlert,
        handlers;

    institutions = [{
        "uri": "http://test1.io",
        "key": "823372507340798303",
        "name": "Test1 Institution",
        "emailAddress": "test1@institution.io"
    }, {
        "uri": "http://test2.io",
        "key": "823372507340798301",
        "name": "Test2 Institution",
        "emailAddress": "test2@institution.io"
    }];

    beforeEach(() => {
        showAlert = false;
        institutionDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        handlers = {
            onEdit: jest.fn(),
            onCreate: jest.fn(),
            onDelete: jest.fn()
        };
        institutionsLoaded = {
            status: ACTION_STATUS.SUCCESS,
            institutions
        };
        institutionsLoadedEmpty = {
            status: ACTION_STATUS.SUCCESS,
            institutions: []
        };
    });

    it('shows loader', function () {
        institutionsLoaded = {
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoaded} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(result).not.toBeNull();
    });

    it('shows error about institutions were not loaded', function () {
        institutionsLoaded = {
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoaded} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('renders card with text, that no institutions were found', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoadedEmpty} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const text = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p');
        expect(text.length).toEqual(1);
    });

    it('renders card with table and institutions', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoaded} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'th');
        expect(th.length).toEqual(3);
    });

    it('renders "Create institution" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoaded} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(7);

        TestUtils.Simulate.click(buttons[6]); // Create Institution
        expect(handlers.onCreate).toHaveBeenCalled();
    });

    it('renders successful alert that institution was successfully deleted', function () {
        showAlert = true;
        institutionDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoaded} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('renders unsuccessful alert that institution was not deleted', function () {
        showAlert = true;
        institutionDeleted = {
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutionsLoaded={institutionsLoaded} showAlert={showAlert}
                              institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});