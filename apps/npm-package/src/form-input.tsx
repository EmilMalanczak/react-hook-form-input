import type { ReactElement } from "react";
import type { FieldValues } from "react-hook-form";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import type {
  AllowedElement,
  FormInputProps,
  PolymorphicRef,
} from "./form-input-bare";
import { FormInputBare } from "./form-input-bare";

type FormInputComponent = <
  Form extends FieldValues,
  Input extends AllowedElement = "input",
>(
  props: Omit<FormInputProps<Form, Input>, "control">,
) => ReactElement;

export const FormInputComponent = forwardRef(
  <Form extends FieldValues, Input extends AllowedElement = "input">(
    props: Omit<FormInputProps<Form, Input>, "control">,
    ref?: PolymorphicRef<Input>,
  ) => {
    const { control } = useFormContext<Form>();

    // NOTE: Seems like typescript doesn't like this due to Omit
    return (
      <FormInputBare
        {...(props as FormInputProps<Form, Input>)}
        control={control}
        ref={ref}
      />
    );
  },
);

FormInputComponent.displayName = "FormInput";

export const FormInput = FormInputComponent as FormInputComponent;
