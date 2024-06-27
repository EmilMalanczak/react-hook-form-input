import { FieldValues, UseControllerReturn } from "react-hook-form";

declare global {
  export interface FormInputAdapterKeys {
    _default: Omit<
      FormInputForwardedProps,
      "field" | "fieldState" | "formState"
    >;
  }
}

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
export type MappingFunction<
  InputProps extends {},
  Form extends FieldValues = FieldValues,
  OutputProps extends {} = InputProps,
> = (
  forwardedProps: FormInputForwardedProps<Form>,
  otherProps?: InputProps,
) => OutputProps;

// TODO: make it working without the need to declare global interface
export type GlobalAdapterProps<
  Key extends keyof FormInputAdapterKeys,
  InputType extends "input" | "output",
> = FormInputAdapterKeys[Key] extends {
  input: infer InputProps extends {};
  output: infer OutputProps extends {};
}
  ? InputType extends "input"
    ? InputProps
    : OutputProps
  : FormInputAdapterKeys[Key];

export type AdapterObject = {
  [AdapterKey in keyof FormInputAdapterKeys]: {
    key: AdapterKey;
    transformFn: MappingFunction<
      GlobalAdapterProps<AdapterKey, "input">,
      FieldValues,
      GlobalAdapterProps<AdapterKey, "output">
    >;
  };
}[keyof FormInputAdapterKeys];
