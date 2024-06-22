import { describe, expect, it } from "vitest";
import { getNestedValue } from "./get-nested-value";


describe("getNestedValue", () => {
  const testData = {
    user: {
      id: 1,
      name: "John Doe",
      posts: [
        { id: 101, title: "Post 1" },
        { id: 102, title: "Post 2" },
      ],
    },
  };

  it("accesses a top-level property", () => {
    const result = getNestedValue(testData, "user");
    expect(result).toEqual(testData.user);
  });

  it("accesses a deeply nested property", () => {
    const result = getNestedValue(testData, "user.name");
    expect(result).toBe("John Doe");
  });

  it("returns undefined for a non-existent property", () => {
    const result = getNestedValue(testData, "user.age");
    expect(result).toBeUndefined();
  });

  it("returns a default value for a non-existent property", () => {
    const defaultValue = "N/A";
    const result = getNestedValue(testData, "user.age", defaultValue);
    expect(result).toBe(defaultValue);
  });

  it("accesses an array element by index", () => {
    const result = getNestedValue(testData, "user.posts[0]");
    expect(result).toEqual(testData.user.posts[0]);
  });

  it("accesses a nested property within an array element", () => {
    const result = getNestedValue(testData, "user.posts[1].title");
    expect(result).toBe("Post 2");
  });

  it("handles undefined or null values gracefully", () => {
    const result = getNestedValue(
      undefined,
      "user.posts[1].title",
      "Default Title",
    );
    expect(result).toBe("Default Title");
  });
});
