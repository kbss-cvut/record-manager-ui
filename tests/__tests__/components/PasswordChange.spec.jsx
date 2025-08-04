"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import PasswordChange from "../../../src/components/user/PasswordChange";
import * as UserFactory from "../../../src/utils/EntityFactory";
import enLang from "../../../src/i18n/en";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { admin, entryClerk } from "../../__mocks__/users.js";

describe("PasswordChange", function () {
  const intlData = enLang;
  let valid,
    adminMatch,
    entryClerkMatch,
    passwordChange,
    currentUser,
    currentUserAdmin,
    handlers,
    passwordEmpty,
    passwordFilled;

  beforeEach(() => {
    handlers = {
      onSave: vi.fn(),
      onCancel: vi.fn(),
      onChange: vi.fn(),
    };
    valid = true;
  });

  adminMatch = {
    params: {
      username: admin.username,
    },
  };

  entryClerkMatch = {
    params: {
      username: entryClerk.username,
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
          currentUser={admin}
          valid={valid}
          passwordChange={passwordChange}
          match={adminMatch}
          password={passwordFilled}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    expect(buttons[1].disabled).toBeFalsy();
    TestUtils.Simulate.click(buttons[1]); // save
    expect(handlers.onSave).toHaveBeenCalled();
  });

  it('renders disabled "Save" button', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={admin}
          valid={valid}
          passwordChange={passwordChange}
          match={adminMatch}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    expect(buttons[0].disabled).toBeTruthy();
  });

  it("shows alert that password is not valid", function () {
    valid = false;
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <PasswordChange
          handlers={handlers}
          currentUser={admin}
          valid={valid}
          passwordChange={passwordChange}
          match={adminMatch}
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
          currentUser={admin}
          valid={valid}
          passwordChange={passwordChange}
          match={entryClerkMatch}
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
          currentUser={admin}
          valid={valid}
          passwordChange={passwordChange}
          match={adminMatch}
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
          currentUser={admin}
          valid={valid}
          passwordChange={passwordChange}
          match={adminMatch}
          password={passwordEmpty}
        />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    TestUtils.Simulate.click(buttons[2]); // cancel
    expect(handlers.onCancel).toHaveBeenCalled();
  });
});
