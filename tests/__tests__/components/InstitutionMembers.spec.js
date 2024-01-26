import TestUtils from "react-dom/test-utils";
import {ACTION_STATUS, ROLE} from "../../../js/constants/DefaultConstants";
import React from "react";
import {IntlProvider} from "react-intl";
import InstitutionMembers from "../../../js/components/institution/InstitutionMembers";
import enLang from '../../../js/i18n/en';

describe('InstitutionMembers', function () {
    const intlData = enLang;
    let institutionMembers,
        institutionMembersEmpty,
        members,
        institution,
        onEditUser = jest.fn(),
        onAddNewUser = jest.fn(),
        onDelete = jest.fn(),
        user,
        admin,
        userDeleted;

    members = [
        {
            username: 'test1',
            firstName: 'test',
            lastName: 'test',
            emailAddress: 'test@test.cz'
        },
        {
            username: 'test2',
            firstName: 'test',
            lastName: 'test',
            emailAddress: 'test@test.cz'
        }
    ];

    institutionMembersEmpty = {
        status: ACTION_STATUS.SUCCESS,
        members: []
    };

    institution = {
        key: 23123323312
    };

    user = {
        username: 'user',
        role: ROLE.DOCTOR
    };

    admin = {
        username: 'admin',
        role: ROLE.ADMIN
    };

    userDeleted = {
        status: ACTION_STATUS.SUCCESS
    };

    beforeEach(() => {
        institutionMembers = {
            status: ACTION_STATUS.SUCCESS,
            members
        };
    });

    it('shows loader', function () {
        institutionMembers = {
            status: ACTION_STATUS.PENDING
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembers}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={admin} userDeleted={userDeleted}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(result).not.toBeNull();
    });

    it('renders card with table and table headers and columns', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembers}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={admin} userDeleted={userDeleted}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(4);
        const td = TestUtils.scryRenderedDOMComponentsWithTag(tree,'td');
        expect(td.length).toEqual(8);
    });

    it('renders card with text, that no members were found', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembersEmpty}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={admin} userDeleted={userDeleted}/>
            </IntlProvider>);
        const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'card');
        expect(cardHeading).not.toBeNull();
        const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'card-body');
        expect(cardBody).not.toBeNull();
        const text = TestUtils.scryRenderedDOMComponentsWithTag(tree,'p');
        expect(text.length).toEqual(1);
    });

    it('renders "Add new user" button for admin and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembersEmpty}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={admin} userDeleted={userDeleted}/>
            </IntlProvider>);
        const button = TestUtils.findRenderedDOMComponentWithTag(tree, "Button");
        expect(button).not.toBeNull();
        TestUtils.Simulate.click(button);
        expect(onAddNewUser).toHaveBeenCalled();
    });

    it('does not render "Add new user" button for user', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembersEmpty}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={user} userDeleted={userDeleted}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(0);
    });

    it('renders "Delete" button for admin for deleting user and opens modal when click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembers}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={admin} userDeleted={userDeleted}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(5);
        TestUtils.Simulate.click(buttons[1]); // Delete button
        const modal = TestUtils.scryRenderedDOMComponentsWithClass(tree, "modal-dialog");
        expect(modal).not.toBeNull();
    });

    it('does not render "Delete" button for user, renders only open button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionMembers institution={institution} institutionMembers={institutionMembers}
                                    onDelete={onDelete} onEditUser={onEditUser} onAddNewUser={onAddNewUser}
                                    currentUser={user} userDeleted={userDeleted}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);
        TestUtils.Simulate.click(buttons[0]); // Delete button
        expect(onEditUser).toHaveBeenCalled();
    });
});