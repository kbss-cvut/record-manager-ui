import TestUtils from "react-dom/test-utils";
import React from "react";
import { IntlProvider } from "react-intl";
import InstitutionPatients from "../../../src/components/institution/InstitutionPatients";
import enLang from "../../../src/i18n/en";
import { SortDirection } from "../../../src/constants/DefaultConstants";
import { describe, expect, it, vi } from "vitest";
import { admin } from "../../__mocks__/users.js";

describe("InstitutionPatients", function () {
  const intlData = enLang;
  let recordsLoaded,
    formTemplatesLoaded = {},
    filterAndSort = {
      sort: {
        date: SortDirection.DESC,
      },
      filters: {},
      onChange: vi.fn(),
    },
    onEdit = vi.fn(),
    onExport = vi.fn();

  it("renders card", function () {
    recordsLoaded = {
      records: [],
    };
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <InstitutionPatients
          recordsLoaded={recordsLoaded}
          formTemplatesLoaded={formTemplatesLoaded}
          filterAndSort={filterAndSort}
          onEdit={onEdit}
          onExport={onExport}
          currentUser={admin}
        />
      </IntlProvider>,
    );
    const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, "card");
    expect(cardHeading).not.toBeNull();
    const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, "card-body");
    expect(cardBody).not.toBeNull();
  });
});
