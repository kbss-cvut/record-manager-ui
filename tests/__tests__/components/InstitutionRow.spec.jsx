"use strict";

import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import InstitutionRow from "../../../src/components/institution/InstitutionRow";
import enLang from "../../../src/i18n/en";

describe("InstitutionRow", function () {
  const intlData = enLang;
  let institution,
    deletionLoading = false,
    onEdit = jest.fn(),
    onDelete = jest.fn();

  institution = {
    uri: "http://test.io",
    key: "823372507340798303",
    name: "Test Institution",
    emailAddress: "test@institution.io",
  };

  it("renders one row of table with 3 columns and 3 buttons", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <InstitutionRow
              institution={institution}
              onEdit={onEdit}
              onDelete={onDelete}
              deletionLoading={deletionLoading}
            />
          </tbody>
        </table>
      </IntlProvider>,
    );
    const td = TestUtils.scryRenderedDOMComponentsWithTag(tree, "td");
    expect(td.length).toEqual(3);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);
  });

  it('renders "Open" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <InstitutionRow
              institution={institution}
              onEdit={onEdit}
              onDelete={onDelete}
              deletionLoading={deletionLoading}
            />
          </tbody>
        </table>
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    TestUtils.Simulate.click(buttons[0]); // Open Institution
    expect(onEdit).toHaveBeenCalled();
  });

  it("renders name with link and click on it", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <InstitutionRow
              institution={institution}
              onEdit={onEdit}
              onDelete={onDelete}
              deletionLoading={deletionLoading}
            />
          </tbody>
        </table>
      </IntlProvider>,
    );

    const link = TestUtils.findRenderedDOMComponentWithClass(tree, "btn-link");
    expect(link).not.toBeNull();

    TestUtils.Simulate.click(link);
    expect(onEdit).toHaveBeenCalled();
  });

  it('renders "Delete" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <table>
          <tbody>
            <InstitutionRow
              institution={institution}
              onEdit={onEdit}
              onDelete={onDelete}
              deletionLoading={deletionLoading}
            />
          </tbody>
        </table>
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(3);

    TestUtils.Simulate.click(buttons[2]); // Delete Institution
    expect(onDelete).toHaveBeenCalled();
  });
});
