import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import {ROLE} from "../../js/constants/DefaultConstants";
import Dashboard from "../../js/components/dashboard/Dashboard";

describe('Dashboard', function () {
    const intlData = require('../../js/i18n/en');
    let currentUserAdmin = {
            username: 'test',
            role: ROLE.ADMIN,
            firstName: 'testName'
        },
        currentUserDoctor = {
            username: 'test',
            role: ROLE.DOCTOR
        },
        handlers = {
            showUsers: jasmine.createSpy('showUsers'),
            showInstitutions: jasmine.createSpy('showInstitutions'),
            showRecords: jasmine.createSpy('showRecords'),
            createRecord: jasmine.createSpy('createRecord'),
        };

    it('should render dashboard with title and four buttons', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Dashboard currentUser={currentUserAdmin} handlers={handlers}/>
            </IntlProvider>);
        const title = TestUtils.findRenderedDOMComponentWithClass(tree, "formatted-message-size");
        expect(title).not.toBeNull();

        const name = TestUtils.findRenderedDOMComponentWithClass(tree, "bold");
        expect(name.textContent).toEqual(currentUserAdmin.firstName);

        const container = TestUtils.findRenderedDOMComponentWithClass(tree, "container");
        expect(container).not.toBeNull();

        const jumbotron = TestUtils.findRenderedDOMComponentWithClass(tree, "jumbotron");
        expect(jumbotron).not.toBeNull();

        const cols = TestUtils.scryRenderedDOMComponentsWithClass(tree, "dashboard-sector");
        expect(cols.length).toEqual(4);
    });

    it('should render four buttons to admin and click on them', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Dashboard currentUser={currentUserAdmin} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "button");
        expect(buttons.length).toEqual(4);

        TestUtils.Simulate.click(buttons[0]); // Create record
        expect(handlers.createRecord).toHaveBeenCalled();

        TestUtils.Simulate.click(buttons[1]); // View users
        expect(handlers.showUsers).toHaveBeenCalled();

        TestUtils.Simulate.click(buttons[2]); // View institutions
        expect(handlers.showInstitutions).toHaveBeenCalled();

        TestUtils.Simulate.click(buttons[3]); // View patients records
        expect(handlers.showRecords).toHaveBeenCalled();
    });

    it('should render three buttons to doctor and click on them', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Dashboard currentUser={currentUserDoctor} handlers={handlers}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "button");
        expect(buttons.length).toEqual(3);

        TestUtils.Simulate.click(buttons[0]); // Create record
        expect(handlers.createRecord).toHaveBeenCalled();

        TestUtils.Simulate.click(buttons[1]); // View institutions
        expect(handlers.showInstitutions).toHaveBeenCalled();

        TestUtils.Simulate.click(buttons[2]); // View patients records
        expect(handlers.showRecords).toHaveBeenCalled();
    });
});