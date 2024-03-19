"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import HistoryRow from "../../../src/components/history/HistoryRow";
import enLang from "../../../src/i18n/en";

describe("HistoryRow", function () {
  const intlData = enLang;
  let action = { key: "12345", type: "TEST", author: { username: "test" }, timestamp: 1526074842 },
    onOpen = jest.fn();

  it("renders one row of table with 4 columns and 1 button", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <HistoryRow key={action.key} action={action} onOpen={onOpen} />
          </tbody>
        </table>
      </IntlProvider>,
    );
    const td = TestUtils.scryRenderedDOMComponentsWithTag(tree, "td");
    expect(td.length).toEqual(4);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(1);
  });

  it('renders "Open" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <HistoryRow key={action.key} action={action} onOpen={onOpen} />
          </tbody>
        </table>
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(1);

    TestUtils.Simulate.click(buttons[0]); // Open Action
    expect(onOpen).toHaveBeenCalled();
  });
});
