import { FieldValues, UseControllerReturn } from "react-hook-form";

export type FormInputForwardedProps<Form extends FieldValues = FieldValues> =
  UseControllerReturn<Form> & {
    error?: string | null;
    name: string;
    value: any;
    onChange: (...args: any[]) => void;
    onBlur: (...args: any[]) => void;
  };

/**
 * A function type that maps the forwarded props from react-hook-form
 * to the component's props.
 *
 * @template ComponentProps - The type of the component's props.
 * @template Form - The type of the form values.
 *
 * @param {FormInputForwardedProps<Form>} forwardedProps - The forwarded props from react-hook-form.
 * @param {ComponentProps} otherProps - The standard props passed to the form input component.
 * @returns {ComponentProps} The new props after transformFn.
 */
type MappingFunction<
  ComponentProps extends {},
  Form extends FieldValues = FieldValues,
> = (
  forwardedProps: FormInputForwardedProps<Form>,
  otherProps: ComponentProps,
) => ComponentProps;

type AdapterObject<ComponentProps extends {}> = {
  key: string;
  transformFn: MappingFunction<ComponentProps>;
};

export const DEFAULT_ADAPTER_KEY = "_default";

class FormInputAdapters {
  private adapters = new Map<string, MappingFunction<any>>();

  constructor() {
    this.register({
      key: DEFAULT_ADAPTER_KEY,
      transformFn: (props) => props,
    });
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
