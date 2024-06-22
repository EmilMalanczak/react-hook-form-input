import { get, UseControllerReturn } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { getErrorFromController } from "../../src/helpers/get-error-from-controller";

describe("getErrorFromController", () => {
  it("should return fieldState error if its truthy", () => {
    const errorMock = { message: "Specific error message" };
    const mockedController = {
      fieldState: { error: errorMock },
    } as unknown as UseControllerReturn;

    const result = getErrorFromController(mockedController);
    expect(result).toBe(errorMock);
  });

  it("should not throw an Error when fieldState error is falsy", () => {
    const mockedController = {
      fieldState: { error: undefined },
    } as unknown as UseControllerReturn;

    expect(() => getErrorFromController(mockedController)).not.toThrow();
  });

  it('should return undefined when field error is falsy and "alternativeErrorKeys" are not provided', () => {
    const mockedController = {
      fieldState: { error: undefined },
    } as unknown as UseControllerReturn;

    const result = getErrorFromController(mockedController);

    expect(result).toBeUndefined();
  });

  it("should return undefined when field error is falsy and none of the alternativeErrorKeys are found", () => {
    const mockedController = {
      fieldState: { error: undefined },
      formState: { errors: {} },
    } as unknown as UseControllerReturn;

    const result = getErrorFromController(mockedController, ["key1", "key2"]);

    expect(result).toBeUndefined();
  });

  it("should return the error from the first alternativeErrorKey found", () => {
    const mockedController = {
      fieldState: { error: undefined },
      formState: {
        errors: {
          key1: "error1",
          key2: "error2",
        },
      },
    } as unknown as UseControllerReturn;

    const result = getErrorFromController(mockedController, ["key1", "key2"]);

    expect(result).toBe("error1");
  });
});
