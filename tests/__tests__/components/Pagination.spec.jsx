import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import Pagination from "../../../src/components/misc/Pagination";
import enLang from "../../../src/i18n/en";
import { describe, expect, it, vi } from "vitest";

describe("Pagination", function () {
  const intlData = enLang;
  let handlePagination = vi.fn();

  it("renders pagination with first, previous and next button", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Pagination pageNumber={0} itemCount={26} handlePagination={handlePagination} />
      </IntlProvider>,
    );
    const pagination = TestUtils.findRenderedDOMComponentWithClass(tree, "pagination");
    expect(pagination).not.toBeNull();
    const li = TestUtils.scryRenderedDOMComponentsWithTag(tree, "li");
    expect(li.length).toEqual(4);
  });
});
