import { vi } from "vitest";

let dateNowSpy;

/**
 * Mocks Date.now result to return a predefined value.
 */
export function mockDateNow(value = Date.now()) {
  dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(value);
}

/**
 * Restores Date.now functionality to the default.
 */
export function restoreDateNow() {
  dateNowSpy.mockRestore();
}
