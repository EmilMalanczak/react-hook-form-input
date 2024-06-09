import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FC,
  PropsWithChildren,
  ReactElement,
} from "react";
import type {
  Control,
  FieldValues,
  Path,
  UseControllerProps,
  UseControllerReturn,
} from "react-hook-form";
import { forwardRef } from "react";
import { useController } from "react-hook-form";

import { getErrorFromController } from "./helpers/get-error-from-controller";
import { getErrorMessage } from "./helpers/get-error-message";
import { mergeRefs } from "./helpers/merge-refs";

// NOTE: ElementType accept object with minimal props to pass

// https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
// When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).
declare const emptyObjectSymbol: unique symbol;
export type EmptyObject = { [emptyObjectSymbol]?: never };

type PrefixedRecord<Obj, Prefix extends string> = {
  [Key in keyof Obj as Key extends string
    ? `${Prefix}${Capitalize<Key>}`
    : never]: Obj[Key];
};

// TODO: add minimal props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequiredFormInputComponentProps = any;

export type AllowedElement = ElementType<
  RequiredFormInputComponentProps,
  "input" | "select" | "textarea"
>;

// type Props = {
// onChange?: (...args: unknown[]) => void;
// };

type PolymorphicProp<Input extends ElementType> = {
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   */
  input?: Input;
};

/**
 * This is the internal props for the component
 */
type FormInputInternalOwnProps<Form extends FieldValues> = {
  /** 
        @string name of the field in form
      */
  name: Path<Form>;
  /** 
       @object control object from useForm hook 
     */
  control: Control<Form>;
  /** 
      @string optional field from form fields to display error message
    */
  alternativeErrorKeys?: Path<Form>[];
  /** 
      @boolean if true will log to console input changes with detailed information
    */
  debug?: boolean;
  /** 
      @string in case your component uses different key than value eg. "checked" for checkbox
      @default "value"
    */
  valueKey?: string;
  /** 
       @string in case your component uses different key than onChange  
       @default "onChange"
     */
  onChangeKey?: string;
  /**  
      @string in case your component uses different key than onBlur
      @default "onBlur"      
    */
  onBlurKey?: string;
};

export type FormInputComponentProps<Form extends FieldValues> =
  UseControllerReturn<Form, Path<Form>> & {
    error?: string;
    name: string;
  };

type ControlledInputPropsKeys = "onChange" | "value";

type PropsToOmit<C extends AllowedElement, P> = keyof (PolymorphicProp<C> & P) &
  keyof FormInputInternalOwnProps<EmptyObject> &
  ("onChange" | "value");

type PolymorphicComponentProp<
  Input extends AllowedElement,
  Props = EmptyObject,
> = Omit<
  PropsWithChildren<Props & PolymorphicProp<Input>>,
  ControlledInputPropsKeys
> &
  Omit<
    ComponentPropsWithoutRef<Input>,
    PropsToOmit<Input, Props> | ControlledInputPropsKeys
  >;

type PolymorphicComponentPropWithRef<
  Input extends AllowedElement,
  Props = EmptyObject,
> = PolymorphicComponentProp<Input, Props> & {
  ref?: PolymorphicRef<Input>;
};

// This is the type for the "ref" only
export type PolymorphicRef<Input extends AllowedElement> =
  ComponentPropsWithRef<Input>["ref"];

export type AdditionalControllerProps = PrefixedRecord<
  Omit<UseControllerProps, "name" | "control">,
  "_controller"
>;

export type FormInputProps<
  Form extends FieldValues,
  Input extends AllowedElement,
> = PolymorphicComponentPropWithRef<Input, FormInputInternalOwnProps<Form>> &
  AdditionalControllerProps;

export type FormInputForwardedProps = UseControllerReturn & {
  error?: string | null;
  name: string;
};

/**
 * This is the type used in the type annotation for the component
 */
type FormInputBareComponent = <
  Form extends FieldValues,
  Input extends AllowedElement = "input",
>(
  props: FormInputProps<Form, Input>,
) => ReactElement;

const FormInputComponent = forwardRef(
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
      _controllerRules,
      _controllerShouldUnregister,
      _controllerDefaultValue,
      _controllerDisabled,
      ...rest
    }: FormInputProps<Form, Input>,
    ref?: PolymorphicRef<Input>,
  ) => {
    const controller = useController<Form>({
      name,
      control,
      rules: _controllerRules,
      shouldUnregister: _controllerShouldUnregister,
      defaultValue: _controllerDefaultValue,
      disabled: _controllerDisabled,
    });
    const { field } = controller;

    const { onChange, onBlur, ref: hookFormRef, value } = field;

    const error = getErrorFromController(controller, alternativeErrorKeys);

    const InputComponent = input ?? "input";

    return (
      <InputComponent
        {...rest}
        ref={mergeRefs(hookFormRef, ref)}
        {...{
          [valueKey]: value,
          name,
          error: error ? getErrorMessage(error) : undefined,
          // NOTE: don't know how to type this properly but types are correct in the end
          [onChangeKey]: (...values: unknown[]) => {
            onChange(...values);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            onInputComponentChange?.(...values);

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
                  field,
                },
              );
            }
          },
          // NOTE: don't know how to type this properly but types are correct in the end
          [onBlurKey]: (...values: unknown[]) => {
            onBlur();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            onInputComponentBlur?.(...values);
          },
          ...controller,
        }}
      />
    );
  },
);

FormInputComponent.displayName = "FormInputBare";

export const FormInputBare = FormInputComponent as FormInputBareComponent;
