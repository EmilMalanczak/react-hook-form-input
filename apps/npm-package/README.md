Typesafe and simple implementation of polymorphic _Smart component_ component for `react-hook-form` package.

## Motivation

If you are here I suppose you use `react-hook-form` to work with your forms. Have you heard about [Smart components](https://react-hook-form.com/advanced-usage#SmartFormComponent)? It's really cool approach - **_magic 🪄_** just happens.

Main purpose of this project is to make this pattern easy to integrate with your current codebase by combining **_polymoprhic_** and **_Smart Component_** approaches.

## Features

- simple
- ea

## Getting started

```bash
npm install hookform-input

yarn add hookform-input

pnpm add hookform-input
```

## Core

To achieve maximum compatibility with UI libraries `FormInput` is making usage of **controlled** version of `react-hook-form`.

This package exposes 2 component:

- `FormInputBare` - base core component that requires `control` prop .
- `FormInput` - re-export of the `FormInputBare` with subscription to `react-hook-form` [Context API](https://react-hook-form.com/advanced-usage#FormProviderPerformance) so there is no need for `control` prop anymore.

Each of components require 2 props:

- `name` - a path to the field, same as `name` for `react-hook-form`
- `input` - literally **_any_** component or some basic html tags as `input | textarea | select`. The only requirement is to support kind of `value` and `onChange` props (or their equivalents)

---

Input component passed to the `FormInput` always receive extra props of type:

```ts
export type FormInputComponentProps<Form extends FieldValues> =
  UseControllerReturn<Form, Path<Form>> & {
    error?: string; // error for particular field, including any of alternativeKeys
    name: string; // a path passed as a prop
  };
```

---

in case you don't like code as below:

```tsx
const TextInput = (
  /* some code */

  <FormInput name="field.inside.form" input={TextInput} />
);
```

Each of component has its _factory function_ which allows you to reexport `FormInput` variant with **_predefined input_** prop eg.:

```tsx
const TextInput = /* some code */
const TextFormInput = createFormInput(TextInput)

<TextFormInput
  name="field.inside.form"
/>
```

## API

### Core

#### `FormInputBare`

Polymorphic component that supports multiple input types and custom validation.

**Props**

```ts
/**
   * The component used for the root node. Either a string to use a HTML element or a component.
   */
  input?: Input
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
      @default "value"
    */
  valueKey?: string
  /**
       @string in case your component uses different key than onChange
       @default "onChange"
     */
  onChangeKey?: string
  /**
      @string in case your component uses different key than onBlur
      @default "onBlur"
    */
  onBlurKey?: string
```

And additional props supported by the specified input component.

#### `FormInput`

re-export of `FormInputBare` with predefined `control` props

```ts
Omit<FormInputBareProps, "control">;
```

---

##### License

This project is licensed under the MIT License.

### example with Mantine

```tsx
const MantineFormInput = createFormInput(TextInput)

// usage later on

<MantineFormInput<TestForm>
  name="field.name"
  mx={2}
  ref={inputref}
/>

<FormInputBare
  name="name"
  input={TextInput}
  mx={2}
  control={control}
/>

// we need to pass Form Type as generic - sadly typescript force us to pass 2nd argument
<FormInput<TestForm, typeof TextInput>
  name="name"
  input={TextInput}
  mx={2}
/>

```
