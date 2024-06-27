import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
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
import { EmptyObject } from "type-fest";

import { DEFAULT_ADAPTER_KEY } from "./adapter/default-adapter";
import { formInputAdapters } from "./adapter/form-input-adapters";
import { getErrorFromController } from "./helpers/get-error-from-controller";
import { getErrorMessage } from "./helpers/get-error-message";
import { mergeRefs } from "./helpers/merge-refs";

// NOTE: ElementType accept object with minimal props to pass

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
  /** 
      @string key to use for adapter
    */
  adapterKey?: keyof FormInputAdapterKeys;
};

export type FormInputComponentProps<Form extends FieldValues> =
  UseControllerReturn<Form, Path<Form>> & {
    error?: string;
    name: string;
  };

type ControlledInputPropsKeys = "value";

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
      adapterKey = DEFAULT_ADAPTER_KEY,
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
    const { onChange, onBlur, ref: hookFormRef, value } = controller.field;

    const error = getErrorFromController(controller, alternativeErrorKeys);

    const InputComponent = input ?? "input";

    const adapter = formInputAdapters.get<Form, typeof adapterKey>(adapterKey);

    const propsObject = {
      value,
      name,
      error: error ? getErrorMessage(error) : undefined,
      onChange: (...values: unknown[]) => {
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
              field: controller.field,
            },
          );
        }
      },
      onBlur: (...values: unknown[]) => {
        onBlur();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        onInputComponentBlur?.(...values);
      },
      ...controller,
    };

    return (
      <InputComponent
        ref={mergeRefs(hookFormRef, ref)}
        // TODO: improve this
        {...adapter(propsObject, rest as any)}
      />
    );
  },
);

FormInputComponent.displayName = "FormInputBare";

export const FormInputBare = FormInputComponent as FormInputBareComponent;
