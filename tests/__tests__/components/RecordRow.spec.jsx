import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, vi, test } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
import RecordRow from "../../../src/components/record/RecordRow.jsx";
import { ROLE } from "../../../src/constants/DefaultConstants.js";
import { admin } from "../../__mocks__/users.js";

const defaultProps = {
  disableDelete: false,
  deletionLoading: false,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  record: {
    uri: "http://onto.fel.cvut.cz/ontologies/record-manager/patient-record#instance456619208",
    key: "159968282553298775",
    localName: "Test",
    dateCreated: "1520956570035",
    author: { username: "joe" },
    institution: { key: 12345678, name: "Test institution" },
  },
  currentUser: admin,
};

vi.mock("react-authorization", () => {
  return {
    IfGranted: ({ expected, actual, children }) =>
      expected === ROLE.READ_ALL_RECORDS && actual.includes(ROLE.READ_ALL_RECORDS) ? children : null,
  };
});

const renderComponent = (props) => {
  return renderWithIntl(<RecordRow {...defaultProps} {...props} />);
};

describe("RecordRow", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table row structure", () => {
    renderComponent();
    const row = screen.getByRole("row");
    expect(row).toHaveClass("position-relative");
  });

  it("renders localName in second column", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.record.localName)).toBeInTheDocument();
  });

  it("renders key column and edit button when current user has READ_ALL_RECORDS role", () => {
    renderComponent({ currentUser: { roles: [ROLE.READ_ALL_RECORDS] } });
    expect(screen.getByText(defaultProps.record.key)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.record.institution.name)).toBeInTheDocument();
  });

  it("does not render key column and institution when current user lacks READ_ALL_RECORDS role", () => {
    renderComponent({ currentUser: { roles: [] } });
    expect(screen.queryByText(defaultProps.record.key)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultProps.record.institution.name)).not.toBeInTheDocument();
    expect(screen.getByText(defaultProps.record.localName)).toBeInTheDocument();
  });

  it("always renders Open button regardless of authorization", () => {
    renderComponent({ currentUser: { roles: [] } });
    expect(screen.getByText(getMessageByKey("open"))).toBeInTheDocument();
  });
});
