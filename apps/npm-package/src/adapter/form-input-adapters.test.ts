import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_ADAPTER_KEY } from "./default-adapter";
import { FormInputForwardedProps } from "./form-input-adapter.types";
import { FormInputAdapters } from "./form-input-adapters";

declare global {
  interface FormInputAdapterKeys {
    testAdapter1: {
      error: string;
    };
    testAdapter2: FormInputForwardedProps & {
      something: string;
    };
  }
}

describe("FormInputAdapters", () => {
  let adapters: FormInputAdapters;

  beforeEach(() => {
    adapters = new FormInputAdapters();
  });

  it("initializes with a default adapter", () => {
    const defaultAdapter = adapters.get(DEFAULT_ADAPTER_KEY);

    expect(defaultAdapter).toBeDefined();
  });

  it("registers and retrieves a new adapter successfully", () => {
    const adapterKey = "testAdapter1";

    adapters.register({
      key: adapterKey,
      transformFn: (props, originalProps) => ({
        error: props.error ? "There is an error" : "",
        ...originalProps,
      }),
    });

    const adapter = adapters.get(adapterKey);

    expect(adapter).toBeDefined();
  });

  it("retrieved adapter transforms data as the given transformFn", () => {
    const adapterKey = "testAdapter2";

    adapters.register({
      key: adapterKey,
      transformFn: (props) => ({
        ...props,
        something: "test",
      }),
    });

    const forwardedProps = {
      value: "test",
    } as unknown as FormInputForwardedProps;

    const adapter = adapters.get(adapterKey);

    expect(adapter(forwardedProps)).toEqual({
      ...forwardedProps,
      something: "test",
    });
  });

  it("throws an error when trying to get a non-existent adapter", () => {
    const attemptToGetNonExistentAdapter = () =>
      // @ts-expect-error - non existing key
      adapters.get("nonExistentAdapter");

    expect(attemptToGetNonExistentAdapter).toThrowError(
      "hookform-input: adapter with key nonExistentAdapter not found",
    );
  });
});
