import { FieldValues } from "react-hook-form";

import { DEFAULT_ADAPTER } from "./default-adapter";
import {
  AdapterObject,
  GlobalAdapterProps,
  MappingFunction,
} from "./form-input-adapter.types";

export class FormInputAdapters {
  private adapters = new Map<
    keyof FormInputAdapterKeys,
    MappingFunction<any>
  >();

  constructor() {
    this.register(DEFAULT_ADAPTER);
  }

  /**
   * Registers a new adapter.
   *
   * @template ComponentProps - The type of the component's props.
   * @param {AdapterObject} adapterObject - The adapter object containing key and transformFn function.
   */
  public register({ key, transformFn }: AdapterObject) {
    this.adapters.set(key, transformFn);
  }

  /**
   * Retrieves an adapter by key.
   *
   * @template ComponentProps - The type of the component's props.
   * @template Form - The type of the form values.
   * @param {string} key - The unique key for the adapter.
   * @returns {MappingFunction<ComponentProps, Form>} The transformFn function for the adapter.
   * @throws {Error} If the adapter with the specified key is not found.
   */
  public get<Form extends FieldValues, Key extends keyof FormInputAdapterKeys>(
    key: Key,
  ) {
    const adapter = this.adapters.get(key);

    if (!adapter) {
      throw new Error(`hookform-input: adapter with key ${key} not found`);
    }

    return adapter as MappingFunction<
      GlobalAdapterProps<Key, "input">,
      Form,
      GlobalAdapterProps<Key, "output">
    >;
  }
}

export const formInputAdapters = new FormInputAdapters();
