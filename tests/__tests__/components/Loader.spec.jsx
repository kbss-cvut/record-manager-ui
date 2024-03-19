import React from "react";
import TestUtils from "react-dom/test-utils";
import Loader, { LoaderMask, LoaderCard } from "../../../src/components/Loader";
import { IntlProvider } from "react-intl";
import enLang from "../../../src/i18n/en";

describe("Loader", function () {
  const intlData = enLang;

  it("renders loader", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Loader />
      </IntlProvider>,
    );
    const result = TestUtils.findRenderedDOMComponentWithClass(tree, "loader-spin");
    expect(result).not.toBeNull();
  });

  it("renders loader with card", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <LoaderCard />
      </IntlProvider>,
    );
    const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, "card");
    expect(cardHeading).not.toBeNull();
    const loaderSpin = TestUtils.findRenderedDOMComponentWithClass(tree, "loader-spin");
    expect(loaderSpin).not.toBeNull();
  });

  it("renders loader as mask", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <LoaderMask />
      </IntlProvider>,
    );
    const mask = TestUtils.findRenderedDOMComponentWithClass(tree, "mask");
    expect(mask).not.toBeNull();
    const loaderSpin = TestUtils.findRenderedDOMComponentWithClass(tree, "loader-spin");
    expect(loaderSpin).not.toBeNull();
  });
});
