"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import HistoryTable from "../../../src/components/history/HistoryTable";
import enLang from "../../../src/i18n/en";
import { describe, expect, it, vi } from "vitest";

describe("HistoryTable", function () {
  const intlData = enLang;
  let actions = [],
    searchData = {},
    handlers = {
      handleSearch: vi.fn(),
      handleReset: vi.fn(),
      handleChange: vi.fn(),
      onKeyPress: vi.fn(),
      onOpen: vi.fn(),
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
