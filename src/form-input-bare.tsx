/* eslint-disable @typescript-eslint/ban-types */
import {
  forwardRef,
  type ComponentPropsWithRef,
  type ElementType,
  type PropsWithChildren,
  type ComponentPropsWithoutRef,
  type ReactElement
} from "react"

type PolymorphicProp<Input extends ElementType> = {
  input?: Input
}

type PropsToOmit<C extends ElementType, P> = keyof (PolymorphicProp<C> & P)

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
 * This is the internal props for the component
 */
type FormInputInternalOwnProps = {
  /** 
        @string name of the field in form
      */
  name: string
  /** 
       @object control object from useForm hook 
     */
  control: string
  /** 
      @string optional field from form fields to display error message
    */
  additionalErrorKey?: string
  /** 
      @boolean if true will log to console input changes with detailed informations
    */
  debug?: boolean
  /** 
      @string in case you want to use different key than value to pass value to component 
    */
  valueKey?: string
}

/**
 * This is the updated component props using PolymorphicComponentPropWithRef
 */
export type FormInputProps<Input extends ElementType> =
  PolymorphicComponentPropWithRef<Input, FormInputInternalOwnProps>

/**
 * This is the type used in the type annotation for the component
 */
type FormInputBareComponent = <Input extends ElementType = "span">(
  props: FormInputProps<Input>
) => ReactElement

export const FormInputBare = forwardRef(
  <Input extends ElementType = "span">(
    { input, control, ...rest }: FormInputProps<Input>,
    ref?: PolymorphicRef<Input>
  ) => {
    const InputComponent = input || "span"
    console.log("control", control)

    return <InputComponent {...rest} ref={ref} />
  }
) as FormInputBareComponent
