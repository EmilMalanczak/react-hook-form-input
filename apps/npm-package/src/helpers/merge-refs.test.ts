import { describe, expect, it, vi } from "vitest";

import { mergeRefs } from "./merge-refs";

describe("mergeRefs", () => {
  it("calls a function ref with the node", () => {
    const mockFnRef = vi.fn();
    const node = {};

    mergeRefs(mockFnRef)(node);

    expect(mockFnRef).toHaveBeenCalledWith(node);
  });

  it("sets current on an object ref", () => {
    const objectRef = { current: null };
    const node = { test: "test" };

    mergeRefs<typeof node>(objectRef)(node);
    expect(objectRef.current).toBe(node);
  });

  it("handles multiple refs correctly", () => {
    const mockFnRef = vi.fn();
    const objectRef = { current: null };
    const node = {};

    mergeRefs(mockFnRef, objectRef)(node);

    expect(mockFnRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });

  it("does nothing when ref is undefined", () => {
    const undefinedRef = undefined;
    const node = {};

    expect(() => mergeRefs(undefinedRef)(node)).not.toThrow();
  });

  it("handles null node correctly", () => {
    const mockFnRef = vi.fn();
    const objectRef = { current: null };

    mergeRefs(mockFnRef, objectRef)(null);

    expect(mockFnRef).toHaveBeenCalledWith(null);
    expect(objectRef.current).toBeNull();
  });
});
