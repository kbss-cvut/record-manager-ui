import React from "react";
import { IntlProvider } from "react-intl";
import TestUtils from "react-dom/test-utils";
import Users from "../../../src/components/user/Users";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import enLang from "../../../src/i18n/en";

describe("Users", function () {
  const intlData = enLang;
  let users, usersLoaded, usersLoadedEmpty, handlers;

  users = [
    {
      username: "testman1",
    },
    {
      username: "testman2",
    },
  ];

  beforeEach(() => {
    handlers = {
      onEdit: jest.fn(),
      onCreate: jest.fn(),
      onDelete: jest.fn(),
    };
    usersLoaded = {
      status: ACTION_STATUS.SUCCESS,
      users,
    };
    usersLoadedEmpty = {
      status: ACTION_STATUS.SUCCESS,
      users: [],
    };
  });

  it("renders card with text, that no users were found", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Users usersLoaded={usersLoadedEmpty} handlers={handlers} />
      </IntlProvider>,
    );
    const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, "card");
    expect(cardHeading).not.toBeNull();
    const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, "card-body");
    expect(cardBody).not.toBeNull();
    const text = TestUtils.scryRenderedDOMComponentsWithTag(tree, "p");
    expect(text.length).toEqual(1);
  });

  it("renders card with table and table headers", function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Users usersLoaded={usersLoaded} handlers={handlers} />
      </IntlProvider>,
    );
    const cardHeading = TestUtils.findRenderedDOMComponentWithClass(tree, "card");
    expect(cardHeading).not.toBeNull();
    const cardBody = TestUtils.findRenderedDOMComponentWithClass(tree, "card-body");
    expect(cardBody).not.toBeNull();
    const table = TestUtils.scryRenderedDOMComponentsWithTag(tree, "table");
    expect(table).not.toBeNull();
    const th = TestUtils.scryRenderedDOMComponentsWithTag(tree, "th");
    expect(th.length).toEqual(5);
  });

  it('renders "Create user" button and click on it', function () {
    const tree = TestUtils.renderIntoDocument(
      <IntlProvider locale="en" {...intlData}>
        <Users usersLoaded={usersLoaded} handlers={handlers} />
      </IntlProvider>,
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
    expect(buttons.length).toEqual(7);

    TestUtils.Simulate.click(buttons[6]); // Create User
    expect(handlers.onCreate).toHaveBeenCalled();
  });
});
