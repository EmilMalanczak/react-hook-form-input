/* eslint-disable @typescript-eslint/ban-types */
import { forwardRef, type ElementType, type ReactElement } from "react"

import type { FormInputProps, PolymorphicRef } from "./form-input-bare"
import type { FieldValues } from "react-hook-form"

import { FormInputBare } from "./form-input-bare"

type FormInputComponent = <
  Form extends FieldValues,
  Input extends ElementType = "span"
>(
  props: Omit<FormInputProps<Form, Input>, "control">
) => ReactElement

export const FormInput = forwardRef(
  <Form extends FieldValues, Input extends ElementType = "span">(
    props: FormInputProps<Form, Input>,
    ref?: PolymorphicRef<Input>
  ) => {
    return <FormInputBare {...props} control="control" ref={ref} />
  }
) as FormInputComponent
