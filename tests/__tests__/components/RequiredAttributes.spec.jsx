import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RequiredAttributes from "../../../src/components/record/RequiredAttributes";
import * as RecordState from "../../../src/model/RecordState";
import { describe, expect, vi, test } from "vitest";
import { renderWithIntl } from "../../utils/utils.jsx";
import { canReadRecord } from "../../../src/utils/RoleUtils.js";

const defaultProps = {
  record: {
    author: { firstName: "John", lastName: "Doe" },
    institution: { localName: "testInstitution" },
    dateCreated: 1521225180115,
    key: "640579951330382351",
    localName: "test",
    lastModified: 1521277544192,
    state: RecordState.createRecordState(),
  },
  completed: true,
  onChange: vi.fn(),
  currentUser: { username: "tomas_shelby" },
};

vi.mock("../../../src/utils/RoleUtils.js", () => ({
  canReadRecord: vi.fn(),
}));

const renderComponent = (props) => {
  return renderWithIntl(<RequiredAttributes {...defaultProps} {...props} />);
};

describe("RequiredAttributes", function () {
  beforeEach(() => {
    vi.clearAllMocks();
    canReadRecord.mockReturnValue(true);
  });

  it("renders local name input when current user has ReadRecord permission", () => {
    renderComponent();
    expect(screen.getByTestId("input-localName")).toBeInTheDocument();
  });

  it("does not render local name input when current user lacks ReadRecord permission", () => {
    canReadRecord.mockReturnValue(false);
    renderComponent();
    expect(screen.queryByTestId("input-localName")).not.toBeInTheDocument();
  });

  it("renders form template selection when record has no form template", () => {
    renderComponent();
    expect(screen.getByTestId("input-formTemplate")).toBeInTheDocument();
  });

  it("does not render form template selection when record has a form template and does not have ReadRecord permission", () => {
    canReadRecord.mockReturnValue(false);
    renderComponent({ record: { formTemplate: "template1" } });
    expect(screen.queryByTestId("input-formTemplate")).not.toBeInTheDocument();
  });
});
