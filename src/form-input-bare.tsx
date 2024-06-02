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

// https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
// When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).
declare const emptyObjectSymbol: unique symbol
export type EmptyObject = { [emptyObjectSymbol]?: never }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequiredFormInputComponentProps = any

export type AllowedElement = ElementType<
  RequiredFormInputComponentProps,
  "input" | "select" | "textarea"
>

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
  onBlurKey?: string
}

export type FormInputComponentProps<Form extends FieldValues> =
  UseControllerReturn<Form, Path<Form>> & {
    error?: string
    name: string
  }

type PropsToOmit<C extends AllowedElement, P> = keyof (PolymorphicProp<C> & P) &
  keyof FormInputInternalOwnProps<EmptyObject>

// This is the first reusable type utility we built
type PolymorphicComponentProp<
  Input extends AllowedElement,
  Props = EmptyObject
> = PropsWithChildren<Props & PolymorphicProp<Input>> &
  Omit<ComponentPropsWithoutRef<Input>, PropsToOmit<Input, Props>>

// This is a new type utitlity with ref!
type PolymorphicComponentPropWithRef<
  Input extends AllowedElement,
  Props = EmptyObject
> = PolymorphicComponentProp<Input, Props> & {
  ref?: PolymorphicRef<Input>
}

// This is the type for the "ref" only
export type PolymorphicRef<Input extends AllowedElement> =
  ComponentPropsWithRef<Input>["ref"]

/**
 * This is the updated component props using PolymorphicComponentPropWithRef
 */
export type FormInputProps<
  Form extends FieldValues,
  Input extends AllowedElement
> = PolymorphicComponentPropWithRef<Input, FormInputInternalOwnProps<Form>>

/**
 * This is the type used in the type annotation for the component
 */
type FormInputBareComponent = <
  Form extends FieldValues,
  Input extends AllowedElement = "input"
>(
  props: FormInputProps<Form, Input>
) => ReactElement

export const FormInputBare = forwardRef(
  <Form extends FieldValues, Input extends AllowedElement = "input">(
    {
      input,
      valueKey = "value",
      name,
      control,
      onChange: onInputComponentChange,
      onBlur: onInputComponentBlur,
      debug = false,
      alternativeErrorKeys,
      onChangeKey = "onChange",
      onBlurKey = "onBlur",
      ...rest
    }: FormInputProps<Form, Input>,
    ref?: PolymorphicRef<Input>
  ) => {
    const controller = useController<Form>({
      name,
      control
    })
    const { field } = controller

    const { onChange, onBlur, ref: hookFormRef, value } = field

    const error = getErrorFromController(controller, alternativeErrorKeys)

    const InputComponent = input || "input"

    return (
      <InputComponent
        {...rest}
        ref={mergeRefs(hookFormRef, ref)}
        {...rest}
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
          // NOTE: don't know how to type this properly but types are correct in the end
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [onBlurKey]: (...values: any[]) => {
            onBlur()
            onInputComponentBlur?.(...values)
          },
          ...controller
        }}
      />
    )
  }
) as FormInputBareComponent
