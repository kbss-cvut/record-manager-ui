import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecordProvenance from "../../../src/components/record/RecordProvenance";
import * as RecordState from "../../../src/model/RecordState";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "../../utils/utils.jsx";
import * as ReactIntl from "react-intl";

const defaultProps = {
  record: {
    author: { firstName: "test", lastName: "test" },
    institution: { localName: "testInstitution" },
    dateCreated: 1521225180115,
    key: "640579951330382351",
    localName: "test",
    state: RecordState.createRecordState(),
  },
};

vi.mock("react-intl", async (importOriginal) => {
  const actual = await importOriginal(); // import the real module
  return {
    ...actual,
    FormattedMessage: ({ id, values }) => (
      <span data-testid={id}>
        [{id}]{" "}
        {values
          ? Object.entries(values)
              .map(([k, v]) => `${k}=${v}`)
              .join(", ")
          : ""}
      </span>
    ),
  };
});

const renderComponent = (props) => {
  return renderWithIntl(<RecordProvenance {...defaultProps} {...props} />);
};

describe("RequiredProvenance", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when record is new", () => {
    const { container } = renderComponent({ record: { isNew: true } });
    expect(container.firstChild).toBeNull();
  });

  it("renders only creation message when no lastModified exists", () => {
    renderComponent({
      record: {
        isNew: false,
        dateCreated: "1521225180115",
        author: { firstName: "John", lastName: "Doe" },
      },
    });
    const createdMsg = screen.getByTestId("record.created-by-msg");
    expect(createdMsg).toBeInTheDocument();
    expect(screen.queryByTestId("record.last-edited-msg")).not.toBeInTheDocument();
  });
});
