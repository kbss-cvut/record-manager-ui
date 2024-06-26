"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import InstitutionTable from "../../../src/components/institution/InstitutionTable";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import enLang from "../../../src/i18n/en";
import { describe, expect, it, vi } from "vitest";

describe("InstitutionTable", function () {
  const intlData = enLang;
  let institutions,
    institutionDeleted = {
      status: ACTION_STATUS.SUCCESS,
    },
    handlers = {
      onEdit: vi.fn(),
      onCreate: vi.fn(),
      onDelete: vi.fn(),
    };

  institutions = [
    {
      uri: "http://test.io",
      key: "823372507340798303",
      name: "Test Institution",
      emailAddress: "test@institution.io",
    },
  ];

  it("renders table with 3 headers columns", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <InstitutionTable institutions={institutions} institutionDeleted={institutionDeleted} handlers={handlers} />
      </IntlProvider>,
    );
    const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, "table");
    expect(table).not.toBeNull();
    const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, "th");
    expect(th.length).toEqual(3);
  });

  it('renders modal window by "Delete" button click', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <InstitutionTable institutions={institutions} institutionDeleted={institutionDeleted} handlers={handlers} />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    TestUtils.Simulate.click(buttons[1]); // Delete Institution
    const modal = TestUtils.scryRenderedDOMComponentsWithClass(tree, "modal-dialog");
    expect(modal).not.toBeNull();
  });
});
