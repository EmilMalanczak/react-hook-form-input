import type { FieldValues } from "react-hook-form"

import { FormInput } from "./form-input"
import {
  AllowedElement,
  FormInputBare,
  type FormInputProps
} from "./form-input-bare"

type FormInputFactory<Type extends "bare" | "context" = "context"> = <
  Input extends AllowedElement = "input"
>(
  input: Input
) => <Form extends FieldValues>(
  props: Omit<
    FormInputProps<Form, Input>,
    Type extends "context" ? "control" | "input" : "input"
  >
) => JSX.Element

export const createFormInputBare: FormInputFactory<"bare"> =
  (input) => (props) => (
    <FormInputBare
      input={input}
      {...(props as FormInputProps<FieldValues, typeof input>)}
    />
  )

export const createFormInput: FormInputFactory = (input) => (props) => (
  <FormInput
    input={input}
    {...(props as FormInputProps<FieldValues, typeof input>)}
  />
)
