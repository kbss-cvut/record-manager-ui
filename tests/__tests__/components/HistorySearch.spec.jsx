"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import HistorySearch from "../../../src/components/history/HistorySearch";
import enLang from "../../../src/i18n/en";

describe("HistorySearch", function () {
  const intlData = enLang;
  let searchData = {},
    handlers = {
      handleChange: jest.fn(),
      handleSearch: jest.fn(),
      handleReset: jest.fn(),
    };

  it("renders search with 3 inputs and 2 buttons", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <HistorySearch handlers={handlers} searchData={searchData} />
          </tbody>
        </table>
      </IntlProvider>,
    );
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, "input");
    expect(inputs.length).toEqual(3);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "button");
    expect(buttons.length).toEqual(2);
  });
});
