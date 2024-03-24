import TestUtils from "react-dom/test-utils";
import React from "react";
import { IntlProvider } from "react-intl";
import RecordTable from "../../../src/components/record/RecordTable";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import enLang from "../../../src/i18n/en";
import { ROLE } from "../../../src/constants/DefaultConstants";
import { describe, expect, vi, beforeEach } from "vitest";

describe("RecordTable", function () {
  const intlData = enLang;
  let records,
    recordsLoaded,
    formTemplatesLoaded = {},
    recordDeleted = { status: ACTION_STATUS.SUCCESS },
    handlers = { onEdit: vi.fn() },
    currentUser = {
      username: "testUser",
      role: ROLE.DOCTOR,
    },
    disableDelete = true;

  records = [
    {
      key: 4324344,
    },
    {
      key: 4321434,
    },
  ];

  beforeEach(() => {
    recordsLoaded = {
      status: ACTION_STATUS.SUCCESS,
      records,
    };
  });

  xit("renders table with headers and columns", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <RecordTable
          recordsLoaded={recordsLoaded}
          handlers={handlers}
          disableDelete={disableDelete}
          recordDeleted={recordDeleted}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={currentUser}
        />
      </IntlProvider>,
    );
    const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, "table");
    expect(table).not.toBeNull();
    const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, "th");
    expect(th.length).toEqual(5);
    const td = TestUtils.scryRenderedDOMComponentsWithTag(tree, "td");
    expect(td.length).toEqual(10);
  });

  xit('renders 2 "Open" buttons and 4 link buttons and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <RecordTable
          recordsLoaded={recordsLoaded}
          handlers={handlers}
          disableDelete={disableDelete}
          recordDeleted={recordDeleted}
          formTemplatesLoaded={formTemplatesLoaded}
          currentUser={currentUser}
        />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(6);
    TestUtils.Simulate.click(buttons[0]); // open
    expect(handlers.onEdit).toHaveBeenCalled();
  });
});
