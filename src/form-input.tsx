import { forwardRef, type ReactElement } from "react"
import { useFormContext, type FieldValues } from "react-hook-form"

import type {
  AllowedElement,
  FormInputProps,
  PolymorphicRef
} from "./form-input-bare"

import { FormInputBare } from "./form-input-bare"

type FormInputComponent = <
  Form extends FieldValues,
  Input extends AllowedElement = "input"
>(
  props: Omit<FormInputProps<Form, Input>, "control">
) => ReactElement

export const FormInput = forwardRef(
  <Form extends FieldValues, Input extends AllowedElement = "input">(
    props: Omit<FormInputProps<Form, Input>, "control">,
    ref?: PolymorphicRef<Input>
  ) => {
    const { control } = useFormContext<Form>()

    // NOTE: Seems like typescript doesn't like this due to Omit
    return (
      <FormInputBare
        {...(props as FormInputProps<Form, Input>)}
        control={control}
        ref={ref}
      />
    )
  }
) as FormInputComponent
