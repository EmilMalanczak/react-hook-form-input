import { FieldValues, UseControllerReturn } from "react-hook-form";

export type FormInputForwardedProps<Form extends FieldValues = FieldValues> =
  UseControllerReturn<Form> & {
    error?: string | null;
    name: string;
    value: any;
    onChange: (...args: any[]) => void;
    onBlur: (...args: any[]) => void;
  };

type MappingFunction<
  ComponentProps extends {},
  Form extends FieldValues = FieldValues,
> = (
  forwardedProps: FormInputForwardedProps<Form>,
  otherProps: ComponentProps,
) => ComponentProps;

type AdapterObject<ComponentProps extends {}> = {
  key: string;
  mapping: MappingFunction<ComponentProps>;
};

export const DEFAULT_ADAPTER_KEY = "_default";

class FormInputAdapters {
  private adapters = new Map<string, MappingFunction<any>>();

  constructor() {
    this.register({
      key: DEFAULT_ADAPTER_KEY,
      mapping: (props) => props,
    });
  }

  public register<ComponentProps extends {}>({
    /*
     * @string key for the adapter
     */
    key,
    /*
     * @function mapping function that will be called with value and base props
     * @returns new props
     * @param forwardedProps - forwarded props from hookform-input
     * @param otherProps - props that are passed to the form input as standard props
     */
    mapping,
  }: AdapterObject<ComponentProps>) {
    this.adapters.set(key, mapping);
  }

  public get<ComponentProps extends {}, Form extends FieldValues>(key: string) {
    const adapter = this.adapters.get(key);

    if (!adapter) {
      throw new Error(`hookform-input: adapter with key ${key} not found`);
    }

    return adapter as MappingFunction<ComponentProps, Form>;
  }
}

export const formInputAdapters = new FormInputAdapters();

// formInputAdapters.register<CustomComponentProps>({
//   key: "testAdapter",
//   mapping: (props) => ({
//     valueTest: props.value,
//   }),
// });
