"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import { ROLE } from "../../../js/constants/DefaultConstants";
import PasswordChange from "../../../js/components/user/PasswordChange";
import * as UserFactory from "../../../js/utils/EntityFactory";
import enLang from "../../../js/i18n/en";

describe("PasswordChange", function () {
  const intlData = enLang;
  let valid, match, passwordChange, currentUser, currentUserAdmin, handlers, passwordEmpty, passwordFilled;

  beforeEach(() => {
    handlers = {
      onSave: jest.fn(),
      onCancel: jest.fn(),
      onChange: jest.fn(),
    };
    valid = true;
  });

  currentUser = {
    username: "testUser",
    role: ROLE.DOCTOR,
  };
  currentUserAdmin = {
    username: "testAdmin",
    role: ROLE.ADMIN,
  };

  match = {
    params: {
      username: currentUser.username,
    },
  };

  passwordEmpty = UserFactory.initNewPassword();
  passwordFilled = {
    currentPassword: "aaaa",
    newPassword: "aaaa",
    confirmPassword: "aaaa",
  };

  passwordChange = {};

  it('renders clickable "Save" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={currentUser}
          valid={valid}
          passwordChange={passwordChange}
          match={match}
          password={passwordFilled}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(2);

    expect(buttons[0].disabled).toBeFalsy();
    TestUtils.Simulate.click(buttons[0]); // save
    expect(handlers.onSave).toHaveBeenCalled();
  });

  it('renders disabled "Save" button', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={currentUser}
          valid={valid}
          passwordChange={passwordChange}
          match={match}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(2);

    expect(buttons[0].disabled).toBeTruthy();
  });

  it("shows alert that password is not valid", function () {
    valid = false;
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={currentUser}
          valid={valid}
          passwordChange={passwordChange}
          match={match}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    const alert = TestUtils.findRenderedDOMComponentWithClass(tree, "alert-danger");
    expect(alert).not.toBeNull();
  });

  it("renders 2 inputs for admin who is changing password to someone else", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={currentUserAdmin}
          valid={valid}
          passwordChange={passwordChange}
          match={match}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(inputs.length).toEqual(2);
  });

  it("renders 3 inputs when somebody is changing his password", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={currentUser}
          valid={valid}
          passwordChange={passwordChange}
          match={match}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(inputs.length).toEqual(3);
  });

  it('renders "Cancel" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={currentUser}
          valid={valid}
          passwordChange={passwordChange}
          match={match}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(2);

    TestUtils.Simulate.click(buttons[1]); // cancel
    expect(handlers.onCancel).toHaveBeenCalled();
  });
});
