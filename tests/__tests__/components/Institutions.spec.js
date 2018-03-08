'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import Institutions from "../../../js/components/institution/Institutions";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";

describe('Institutions', function () {
    const intlData = require('../../../js/i18n/en');
    let currentUser,
        institutions,
        institutionDeleted,
        showAlert,
        handlers,
        status;

    beforeEach(() => {
        showAlert = false;
        institutionDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        handlers = {
            onEdit: jasmine.createSpy('onEdit'),
            onCreate: jasmine.createSpy('onCreate'),
            onDelete: jasmine.createSpy('onDelete')
        };
    });

    institutions = [{
        "uri":"http://test1.io",
        "key":"823372507340798303",
        "name":"Test1 Institution",
        "emailAddress":"test1@institution.io"
    }, {
        "uri":"http://test2.io",
        "key":"823372507340798301",
        "name":"Test2 Institution",
        "emailAddress":"test2@institution.io"
    }];

    it('shows loader', function () {
        status = ACTION_STATUS.PENDING;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutions={[]} showAlert={showAlert}
                       institutionDeleted={institutionDeleted} handlers={handlers} status={status}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(result).not.toBeNull();
    });

    it('renders panel with table and institutions', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutions={institutions} showAlert={showAlert}
                       institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const panelHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel');
        expect(panelHeading).not.toBeNull();
        const panelBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel-body');
        expect(panelBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(3);
    });

    it('renders "Create institution" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutions={institutions} showAlert={showAlert}
                       institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(5);

        TestUtils.Simulate.click(buttons[4]); // Create Institution
        expect(handlers.onCreate).toHaveBeenCalled();
    });

    it('renders successful alert that institution was successfully deleted', function () {
        showAlert = true;
        institutionDeleted = {
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Institutions institutions={institutions} showAlert={showAlert}
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
                <Institutions institutions={institutions} showAlert={showAlert}
                       institutionDeleted={institutionDeleted} handlers={handlers}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });
});