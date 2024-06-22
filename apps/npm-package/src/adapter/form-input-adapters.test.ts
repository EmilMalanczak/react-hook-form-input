import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_ADAPTER_KEY } from "./default-adapter";
import { FormInputForwardedProps } from "./form-input-adapter.types";
import { FormInputAdapters } from "./form-input-adapters";

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
    const adapterKey = "testAdapter";

    adapters.register({
      key: adapterKey,
      transformFn: (props) => ({ ...props, modified: true }),
    });

    const adapter = adapters.get(adapterKey);

    expect(adapter).toBeDefined();
  });

  it("retrieved adapter transforms data as the given transformFn", () => {
    const adapterKey = "testAdapter";

    adapters.register({
      key: adapterKey,
      transformFn: (props) => ({ ...props, modified: true }),
    });

    const forwardedProps = {
      value: "test",
    } as unknown as FormInputForwardedProps;

    const adapter = adapters.get(adapterKey);

    expect(adapter(forwardedProps)).toEqual({
      ...forwardedProps,
      modified: true,
    });
  });

  it("throws an error when trying to get a non-existent adapter", () => {
    const attemptToGetNonExistentAdapter = () =>
      adapters.get("nonExistentAdapter");

    expect(attemptToGetNonExistentAdapter).toThrowError(
      "hookform-input: adapter with key nonExistentAdapter not found",
    );
  });
});
