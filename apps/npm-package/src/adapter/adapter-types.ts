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
export type MappingFunction<
  ComponentProps extends {},
  Form extends FieldValues = FieldValues,
> = (
  forwardedProps: FormInputForwardedProps<Form>,
  otherProps?: ComponentProps,
) => ComponentProps;

export type AdapterObject<ComponentProps extends {}> = {
  key: string;
  transformFn: MappingFunction<ComponentProps>;
};
