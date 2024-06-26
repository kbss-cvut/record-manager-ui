"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import RequiredAttributes from "../../../src/components/record/RequiredAttributes";
import * as RecordState from "../../../src/model/RecordState";
import enLang from "../../../src/i18n/en";
import { describe, expect, vi, test } from "vitest";

describe("RequiredAttributes", function () {
  const intlData = enLang;
  let record,
    completed = true,
    onChange = vi.fn();

  record = {
    author: { firstName: "test", lastName: "test" },
    institution: { localName: "testInstitution" },
    dateCreated: 1521225180115,
    key: "640579951330382351",
    localName: "test",
    lastModified: 1521277544192,
    state: RecordState.createRecordState(),
  };

  test.skip("renders form with one input and help", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <RequiredAttributes record={record} onChange={onChange} completed={completed} />
      </IntlProvider>,
    );
    const result = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(result.length).toEqual(1);
    for (let input of result) {
      switch (input.name) {
        case "localName":
          expect(input.value).toEqual("test");
          expect(input.type).toEqual("text");
          break;
      }
    }
    const helpIcon = TestUtils.scryRenderedDOMComponentsWithClass(tree, "help-icon");
    expect(helpIcon.length).toEqual(1);
  });
});
