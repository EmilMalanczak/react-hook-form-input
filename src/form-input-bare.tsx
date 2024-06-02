/* eslint-disable @typescript-eslint/ban-types */
import { forwardRef } from "react"
import { useController } from "react-hook-form"

import type {
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren,
  ComponentPropsWithoutRef,
  ReactElement
} from "react"
import type {
  FieldValues,
  Control,
  Path,
  UseControllerReturn
} from "react-hook-form"

import { getErrorFromController } from "./helpers/get-error-from-controller"
import { getErrorMessage } from "./helpers/get-error-message"
import { mergeRefs } from "./helpers/merge-refs"

// NOTE: ElementType accept object with minimal props to pass

type PolymorphicProp<Input extends ElementType> = {
  input?: Input
}

/**
 * This is the internal props for the component
 */
type FormInputInternalOwnProps<Form extends FieldValues> = {
  /** 
        @string name of the field in form
      */
  name: Path<Form>
  /** 
       @object control object from useForm hook 
     */
  control: Control<Form>
  /** 
      @string optional field from form fields to display error message
    */
  alternativeErrorKeys?: Path<Form>[]
  /** 
      @boolean if true will log to console input changes with detailed information
    */
  debug?: boolean
  /** 
      @string in case your component uses different key than value eg. "checked" for checkbox
    */
  valueKey?: string
  /** 
       @string in case your component uses different key than onChange  
     */
  onChangeKey?: string
}

export type FormInputComponentProps<Form extends FieldValues> = UseControllerReturn<
  Form,
  Path<Form>
> & {
  error?: string
  name: string
}

type PropsToOmit<C extends ElementType, P> = keyof (PolymorphicProp<C> & P) &
  keyof FormInputInternalOwnProps<{}>

// This is the first reusable type utility we built
type PolymorphicComponentProp<
  Input extends ElementType,
  Props = {}
> = PropsWithChildren<Props & PolymorphicProp<Input>> &
  Omit<ComponentPropsWithoutRef<Input>, PropsToOmit<Input, Props>>

// This is a new type utitlity with ref!
type PolymorphicComponentPropWithRef<
  Input extends ElementType,
  Props = {}
> = PolymorphicComponentProp<Input, Props> & {
  ref?: PolymorphicRef<Input>
}

// This is the type for the "ref" only
export type PolymorphicRef<Input extends ElementType> =
  ComponentPropsWithRef<Input>["ref"]

/**
 * This is the updated component props using PolymorphicComponentPropWithRef
 */
export type FormInputProps<
  Form extends FieldValues,
  Input extends ElementType
> = PolymorphicComponentPropWithRef<Input, FormInputInternalOwnProps<Form>>

/**
 * This is the type used in the type annotation for the component
 */
type FormInputBareComponent = <
  Form extends FieldValues,
  Input extends ElementType = "input"
>(
  props: FormInputProps<Form, Input>
) => ReactElement

export const FormInputBare = forwardRef(
  <Form extends FieldValues, Input extends ElementType = "input">(
    {
      input,
      valueKey = "value",
      name,
      control,
      onChange: onInputComponentChange,
      debug = false,
      alternativeErrorKeys,
      onChangeKey = "onChange",
      ...rest
    }: FormInputProps<Form, Input>,
    ref?: PolymorphicRef<Input>
  ) => {
    const controller = useController<Form>({
      name,
      control
    })
    const { field } = controller

    const { onChange, ref: hookFormRef, value } = field

    const error = getErrorFromController(controller, alternativeErrorKeys)

    const InputComponent = input || "input"

    return (
      <InputComponent
        {...rest}
        ref={mergeRefs(hookFormRef, ref)}
        {...{
          [valueKey]: value,
          name,
          error: error ? getErrorMessage(error) : undefined,
          // NOTE: don't know how to type this properly but types are correct in the end
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [onChangeKey]: (...values: any[]) => {
            onChange(...values)
            onInputComponentChange?.(...values)

            // TODO: unsure if this is needed
            // if (getNestedValue(touchedFields, name) || Boolean(error)) {
            //   trigger(name);
            // }

            if (debug) {
              console.info(
                `%cForm input onChange`,
                "color: #7b7bed; display: block; width: 100%; margin-bottom: 8px;",
                `\ninput name: ${name}`,
                {
                  values,
                  name,
                  error,
                  field
                }
              )
            }
          },
          ...controller
        }}
        {...rest}
      />
    )
  }
) as FormInputBareComponent
