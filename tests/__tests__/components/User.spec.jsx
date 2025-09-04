"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import User from "../../../src/components/user/User";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import * as EntityFactory from "../../../src/utils/EntityFactory";
import enLang from "../../../src/i18n/en";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { admin, entryClerk, reviewer, ROLE_GROUPS } from "../../__mocks__/users.js";

describe("User", function () {
  const intlData = enLang;
  let newUser = EntityFactory.initNewUser(),
    institutions,
    backToInstitution,
    userSaved,
    showAlert,
    userLoaded,
    handlers = {
      onSave: vi.fn(),
      onCancel: vi.fn(),
      onChange: vi.fn(),
    };

  newUser = {
    ...newUser,
    password: "test",
  };

  institutions = [
    {
      uri: "http://test1.io",
      key: "823372507340798303",
      name: "Test1 Institution",
      emailAddress: "test1@institution.io",
    },
    {
      uri: "http://test2.io",
      key: "823372507340798301",
      name: "Test2 Institution",
      emailAddress: "test2@institution.io",
    },
  ];

  beforeEach(() => {
    showAlert = false;
    userLoaded = {
      status: ACTION_STATUS.SUCCESS,
      error: "",
    };
    userSaved = {
      status: ACTION_STATUS.SUCCESS,
      error: "",
    };
  });

  it("shows loader", function () {
    userLoaded = {
      status: ACTION_STATUS.PENDING,
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={null}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    const result = TestUtils.findRenderedDOMComponentWithClass(tree, "loader-spin");
    expect(result).not.toBeNull();
  });

  it("shows error about user was not loaded", function () {
    userLoaded = {
      ...userLoaded,
      status: ACTION_STATUS.ERROR,
      error: {
        message: "Error",
      },
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={entryClerk}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
          impersonation={{}}
        />
      </IntlProvider>,
    );
    const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
    expect(alert).not.toBeNull();
  });

  it("renders admin's form empty with random button", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={newUser}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    const inputElements = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    const selectElements = TestUtils.scryRenderedDOMComponentsWithTag(tree, "select");

    expect(inputElements.length).toEqual(5);
    expect(selectElements.length).toEqual(2);

    for (let input of inputElements) {
      switch (input.name) {
        case "firstName":
          expect(input.value).toEqual("");
          expect(input.type).toEqual("text");
          break;
        case "lastName":
          expect(input.value).toEqual("");
          expect(input.type).toEqual("text");
          break;
        case "username":
          expect(input.value).toEqual("");
          expect(input.type).toEqual("text");
          break;
        case "emailAddress":
          expect(input.value).toEqual("");
          expect(input.type).toEqual("email");
          break;
        case "password":
          expect(input.value).toEqual("test");
          expect(input.type).toEqual("text");
          expect(input.readOnly).toBeTruthy();
          break;
      }
    }

    for (let select of selectElements) {
      console.log(select);
      switch (select.name) {
        case "institution":
          expect(select.type).toEqual("select-one");
          break;

        case "roleGroup":
          expect(select.type).toEqual("select-one");
          break;
      }
    }

    const randomButton = TestUtils.scryRenderedDOMComponentsWithClass(tree, "button-random");
    expect(randomButton.length).toEqual(1);
  });

  it('renders clickable "Save" button and click on it', function () {
    const newUserFilled = {
      ...newUser,
      username: "test",
      firstName: "test1",
      lastName: "test2",
      emailAddress: "test@test.cz",
      institution: {},
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={newUserFilled}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    expect(buttons[1].disabled).toBeFalsy();
    TestUtils.Simulate.click(buttons[1]); // save
    expect(handlers.onSave).toHaveBeenCalled();
  });

  it("shows successful alert that user was successfully saved", function () {
    showAlert = true;
    userSaved = {
      ...userSaved,
      status: ACTION_STATUS.SUCCESS,
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={newUser}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
    expect(alert).not.toBeNull();
  });

  it("shows unsuccessful alert that user was not saved", function () {
    showAlert = true;
    userSaved = {
      ...userSaved,
      status: ACTION_STATUS.ERROR,
      error: {
        message: "Error",
      },
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={newUser}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
    expect(alert).not.toBeNull();
  });

  it("renders filled user's form without random button", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={entryClerk}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          impersonation={{}}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(result.length).toEqual(4);
    for (let input of result) {
      switch (input.name) {
        case "firstName":
          expect(input.value).toEqual("EntryClerk");
          expect(input.type).toEqual("text");
          break;
        case "lastName":
          expect(input.value).toEqual("EntryClerkorovitch");
          expect(input.type).toEqual("text");
          break;
        case "username":
          expect(input.value).toEqual("entryClerk");
          expect(input.type).toEqual("text");
          expect(input.disabled).toBeTruthy();
          break;
        case "emailAddress":
          expect(input.value).toEqual("entryClerk@gmail.com");
          expect(input.type).toEqual("email");
          break;
      }
    }
    const selects = TestUtils.scryRenderedDOMComponentsWithTag(tree, "select");
    expect(selects.length).toEqual(2);
    const randomButton = TestUtils.scryRenderedDOMComponentsWithClass(tree, "glyphicon");
    expect(randomButton.length).toEqual(0);
  });

  it("renders filled admin's form", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={admin}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          impersonation={{}}
          roleGroups={ROLE_GROUPS}
        />
      </IntlProvider>,
    );
    const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(result.length).toEqual(4);
    for (let input of result) {
      switch (input.name) {
        case "firstName":
          expect(input.value).toEqual("Admin");
          expect(input.type).toEqual("text");
          break;
        case "lastName":
          expect(input.value).toEqual("Administratorowitch");
          expect(input.type).toEqual("text");
          break;
        case "username":
          expect(input.value).toEqual("admin");
          expect(input.type).toEqual("text");
          expect(input.disabled).toBeTruthy();
          break;
        case "emailAddress":
          expect(input.value).toEqual("admin@gmail.com");
          expect(input.type).toEqual("email");
          break;
      }
    }
    const selects = TestUtils.scryRenderedDOMComponentsWithTag(tree, "select");
    expect(selects.length).toEqual(2);
  });

  it("renders filled user's form", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={reviewer}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
          impersonation={{}}
        />
      </IntlProvider>,
    );
    const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(result.length).toEqual(4);
    for (let input of result) {
      switch (input.name) {
        case "firstName":
          expect(input.value).toEqual("Reviewer");
          expect(input.type).toEqual("text");
          break;
        case "lastName":
          expect(input.value).toEqual("Reviewerevitch");
          expect(input.type).toEqual("text");
          break;
        case "username":
          expect(input.value).toEqual("reviewer");
          expect(input.type).toEqual("text");
          expect(input.disabled).toBeTruthy();
          break;
        case "emailAddress":
          expect(input.value).toEqual("reviewer@gmail.com");
          expect(input.type).toEqual("email");
          break;
      }
    }
  });

  it('renders "Cancel" button and click on it', function () {
    const user = {
      ...newUser,
      username: "test",
      firstName: "test1",
      lastName: "test2",
      emailAddress: "test@test.cz",
      institution: {},
    };

    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={entryClerk}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
          impersonation={{}}
        />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(5);

    TestUtils.Simulate.click(buttons[4]); // cancel
    expect(handlers.onCancel).toHaveBeenCalled();
  });

  it('renders "Back to institution" button and click on it', function () {
    backToInstitution = true;
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={entryClerk}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
          impersonation={{}}
        />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");

    expect(buttons.length).toEqual(5);

    TestUtils.Simulate.click(buttons[4]); // back to institution
    expect(handlers.onCancel).toHaveBeenCalled();
  });

  it('renders loading spinner in "Save" button on saving', function () {
    userSaved = {
      ...userSaved,
      status: ACTION_STATUS.PENDING,
    };

    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <User
          user={entryClerk}
          handlers={handlers}
          backToInstitution={backToInstitution}
          userSaved={userSaved}
          showAlert={showAlert}
          userLoaded={userLoaded}
          currentUser={admin}
          institutions={institutions}
          roleGroups={ROLE_GROUPS}
          impersonation={{}}
        />
      </IntlProvider>,
    );
    const loader = TestUtils.scryRenderedDOMComponentsWithClass(tree, "loader");
    expect(loader).not.toBeNull();
  });
});
