"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import { ACTION_STATUS, ROLE, SortDirection } from "../../../src/constants/DefaultConstants";
import Institution from "../../../src/components/institution/Institution";
import enLang from "../../../src/i18n/en";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("Institution", function () {
  const intlData = enLang;
  let institution,
    newInstitution,
    institutionSaved,
    institutionLoaded,
    admin,
    user,
    institutionMembers = {},
    recordsLoaded = {
      records: [],
    },
    filterAndSort,
    formTemplatesLoaded = {},
    handlers = {
      onSave: vi.fn(),
      onCancel: vi.fn(),
      onChange: vi.fn(),
      onEditUser: vi.fn(),
      onAddNewUser: vi.fn(),
      onDelete: vi.fn(),
      onEditPatient: vi.fn(),
      onExportRecords: vi.fn(),
    };

  user = {
    username: "doctor",
    role: ROLE.DOCTOR,
  };
  admin = {
    username: "admin",
    role: ROLE.ADMIN,
  };

  institution = {
    name: "test",
    emailAddress: "test@test.cz",
  };

  institutionMembers = {
    status: ACTION_STATUS.SUCCESS,
    members: {},
  };

  beforeEach(() => {
    institutionLoaded = {
      status: ACTION_STATUS.SUCCESS,
      error: "",
    };
    institutionSaved = {
      status: ACTION_STATUS.SUCCESS,
      error: "",
    };
    newInstitution = {
      name: "",
      emailAddress: "",
      isNew: true,
    };
    recordsLoaded = {
      status: ACTION_STATUS.SUCCESS,
      records: [],
    };
    filterAndSort = {
      sort: { date: SortDirection.DESC },
      filters: {},
      onChange: vi.fn(),
    };
  });

  it("renders institution's form empty", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Institution
          handlers={handlers}
          institution={newInstitution}
          institutionMembers={institutionMembers}
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={admin}
          institutionLoaded={institutionLoaded}
          filterAndSort={filterAndSort}
          institutionSaved={institutionSaved}
        />
      </IntlProvider>,
    );
    const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(result.length).toEqual(2);
    for (let input of result) {
      switch (input.name) {
        case "localName":
          expect(input.value).toEqual("");
          expect(input.type).toEqual("text");
          break;
        case "email":
          expect(input.value).toEqual("");
          expect(input.type).toEqual("email");
          break;
      }
    }
  });

  it('renders "Save" button for admin and click on it', function () {
    newInstitution = {
      ...newInstitution,
      name: "ahoj",
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Institution
          handlers={handlers}
          institution={newInstitution}
          institutionMembers={institutionMembers}
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={admin}
          institutionLoaded={institutionLoaded}
          filterAndSort={filterAndSort}
          institutionSaved={institutionSaved}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(2);

    TestUtils.Simulate.click(buttons[0]); // save
    expect(handlers.onSave).toHaveBeenCalled();
  });

  it('does not render "Save" button for user', function () {
    newInstitution = {
      ...newInstitution,
      name: "ahoj",
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Institution
          handlers={handlers}
          institution={newInstitution}
          institutionMembers={institutionMembers}
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={user}
          institutionLoaded={institutionLoaded}
          filterAndSort={filterAndSort}
          institutionSaved={institutionSaved}
        />
      </IntlProvider>,
    );
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(1);
  });

  it('renders "Cancel" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Institution
          handlers={handlers}
          institution={institution}
          institutionMembers={institutionMembers}
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={admin}
          institutionLoaded={institutionLoaded}
          filterAndSort={filterAndSort}
          institutionSaved={institutionSaved}
        />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    TestUtils.Simulate.click(buttons[1]); // cancel
    expect(handlers.onCancel).toHaveBeenCalled();
  });

  it('renders loading spinner in "Save" button on saving', function () {
    institutionSaved = {
      ...institutionSaved,
      status: ACTION_STATUS.PENDING,
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Institution
          handlers={handlers}
          institution={institution}
          institutionMembers={institutionMembers}
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={admin}
          institutionLoaded={institutionLoaded}
          filterAndSort={filterAndSort}
          institutionSaved={institutionSaved}
        />
      </IntlProvider>,
    );
    const loader = TestUtils.findRenderedDOMComponentWithClass(tree, "loader");
    expect(loader).not.toBeNull();
  });
});
