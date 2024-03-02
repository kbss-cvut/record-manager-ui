"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import HistoryTable from "../../../js/components/history/HistoryTable";
import enLang from "../../../js/i18n/en";

describe("HistoryTable", function () {
  const intlData = enLang;
  let actions = [],
    searchData = {},
    handlers = {
      handleSearch: jest.fn(),
      handleReset: jest.fn(),
      handleChange: jest.fn(),
      onKeyPress: jest.fn(),
      onOpen: jest.fn(),
    };

  it("renders table with 4 headers columns", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <HistoryTable handlers={handlers} searchData={searchData} actions={actions} />
      </IntlProvider>,
    );
    const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, "table");
    expect(table).not.toBeNull();
    const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, "th");
    expect(th.length).toEqual(4);
  });
});
