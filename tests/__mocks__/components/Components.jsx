import { vi } from "vitest";

vi.mock("../../../src/components/HorizontalInput", () => {
  return {
    default: ({ type, name, label, value, onChange, disabled }) => (
      <div data-testid={`input-${name}`}>
        <label>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} />
      </div>
    ),
  };
});
