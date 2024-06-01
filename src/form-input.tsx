/* eslint-disable @typescript-eslint/ban-types */
import { forwardRef, type ElementType, type ReactElement } from "react"

import {
  FormInputBare,
  type PolymorphicRef,
  type FormInputProps
} from "./form-input-bare"

type FormInputComponent = <Input extends ElementType = "span">(
  props: Omit<FormInputProps<Input>, "control">
) => ReactElement

export const FormInput = forwardRef(
  <Input extends ElementType = "span">(
    props: FormInputProps<Input>,
    ref?: PolymorphicRef<Input>
  ) => {
    return <FormInputBare {...props} control="control" ref={ref} />
  }
) as FormInputComponent
