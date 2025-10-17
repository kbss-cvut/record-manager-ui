# Component Testing

## Libraries & Setup

All component tests use the following libraries and utilities:

| Purpose                           | Library / Utility                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| Testing framework                 | [Vitest](https://vitest.dev/)                                                           |
| Component rendering & interaction | [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) |
| Assertions                        | [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)                |
| Mocking                           | `vi` (from Vitest)                                                                      |
| Internationalization utilities    | `getMessageByKey`, `renderWithIntl` (custom test utils)                                 |

### Example Imports

```js
import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { getMessageByKey, renderWithIntl } from "../../utils/utils.jsx";
```

## File Structure & Naming

Each test file should be located next to or within a corresponding component test folder:

```bash
tests/components/<ComponentName>.test.jsx
```

Example:

```bash
tests/components/Dashboard.test.jsx
```

Test File Structure
Each test file follows the same structure:

1. Imports — libraries, helpers, constants, and the component under test.

2. defaultProps — define a reusable base props object.

3. Mocks — define mock handlers, data, or API responses.

4. renderComponent() — a reusable function to render the component with optional overridden props.

5. Test suite (describe) — wraps all test cases for the component.

6. beforeEach() — resets mocks before each test.

7. Test cases (it) — follow consistent naming and structure.

### Example Test File Structure

```js
import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, expect, beforeEach, it } from "vitest";
import ComponentName from "../../../src/components/.../ComponentName";
import { renderWithIntl, getMessageByKey } from "../../utils/utils.jsx";

const defaultProps = {
  /* base props */
};

vi.mock("path/to/dependency", () => ({
  /* mock implementation */
}));

const renderComponent = (props = {}) => {
  return renderWithIntl(<ComponentName {...defaultProps} {...props} />);
};

describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders something", () => {
    renderComponent();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("calls handler when clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("..."));
    expect(defaultProps.handlers.someHandler).toHaveBeenCalled();
  });
});
```

## Naming Conventions

Each test description should start with a **verb** describing what is being tested.  
Use consistent prefixes for clarity and readability.

| Prefix                      | Purpose                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `renders / does not render` | Verifies that the component renders certain elements or does not under certain conditions |
| `disables / enables`        | Verifies that a control is disabled or enabled                                            |
| `calls`                     | Verifies that a handler function is invoked                                               |
| `opens / closes`            | Verifies modal or dropdown behavior                                                       |

### Example Descriptions

✅ "renders create record tile when user has WRITE_ALL_RECORDS role"

✅ "does not render statistics tile when user lacks READ_STATISTICS role"

✅ "calls showRecords handler when records tile is clicked"
