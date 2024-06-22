import { FieldValues } from "react-hook-form";

import { AdapterObject, MappingFunction } from "./adapter-types";
import { DEFAULT_ADAPTER } from "./default-adapter";

export class FormInputAdapters {
  private adapters = new Map<string, MappingFunction<any>>();

  constructor() {
    this.register(DEFAULT_ADAPTER);
  }

  /**
   * Registers a new adapter.
   *
   * @template ComponentProps - The type of the component's props.
   * @param {AdapterObject<ComponentProps>} adapterObject - The adapter object containing key and transformFn function.
   */
  public register<ComponentProps extends {}>({
    key,
    transformFn,
  }: AdapterObject<ComponentProps>) {
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
  public get<ComponentProps extends {}, Form extends FieldValues>(key: string) {
    const adapter = this.adapters.get(key);

    if (!adapter) {
      throw new Error(`hookform-input: adapter with key ${key} not found`);
    }

    return adapter as MappingFunction<ComponentProps, Form>;
  }
}

export const formInputAdapters = new FormInputAdapters();
