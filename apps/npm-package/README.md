# Introduction

Typesafe and simple implementation of polymorphic _Smart component_ component for `react-hook-form` package.

## Motivation

If you are here I suppose you use `react-hook-form` to work with your forms. Have you heard about [Smart components](https://react-hook-form.com/advanced-usage#SmartFormComponent)? It's really cool approach - **_magic 🪄_** just happens.

Main purpose of this project is to make this pattern easy to integrate with your current codebase by combining **_polymoprhic_** and **_Smart Component_** approaches.

## Getting started

```bash
npm install hookform-input

yarn add hookform-input

pnpm add hookform-input
```

#### Bare minimum to start with!

```tsx
import { FormInput } from "hookform-input";
import { FormProvider, useForm } from "react-hook-form";

const NameForm = () => {
  const form = useForm();

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <FormProvider {...formData}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="username" />

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};
```

## Core

To achieve maximum compatibility with UI libraries `FormInput` is making usage of **controlled** version of input via `useController` hook and/or\* `Context API` exposed by `react-hook-form`.

As everything in apart of some pros there are also cons coming with each decision:

Pros:

- more flexible API
- you can use **_any_** component that supports `value` and `onChange` props (or their equivalents) as `input` prop.

Cons:

- using `FormProvider` might lead to potential [performance issues](https://www.react-hook-form.com/advanced-usage/#FormProviderPerformance) in more complex forms due to more re-renders\*

∗ _depends on what variant of `FormInput` you are using_

### Smart & Polymorphic approach 🧠

Have you heard about [Smart components](https://react-hook-form.com/advanced-usage#SmartFormComponent)?

It's really cool approach - **_magic 🪄_** just happens.

Main purpose of this project is to make this pattern easy to integrate with your current codebase by combining **_polymoprhic_** and **_Smart Component_** approaches.

#### Polymorphic components

In a few words, it is a component that lets us specify which React element we want to use for its root. If you’ve used some UI library, such as [Mantine](https://mantine.dev/) or [Material UI](https://mui.com/material-ui/), you’ve already encountered a polymorphic component.

#### Smart components

According to `react-hook-form` docs:

_"This idea here is that you can easily compose your form with inputs."_

However, it's not that easy to achieve in a real-world application. This package is here to help you with that.
The [example from the docs](https://react-hook-form.com/advanced-usage#SmartFormComponent) is working perfectly fine but has some limitations eg. doesn't supports nested component fields.
Another problem is lack of **typescript** support for `name` field which is really annoying.

## API

### `FormInputBare`

This is a **generic** component so you can provide your own type for `Form` and `input` component props.
In this variant the the `Form` type is beeing read base on the `control` prop so its not required to provide it.

We get full type safety for the `input` component props and our field `name`.

```ts
{
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   */
  input?: Input;
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
```

And additional props supported by the specified `input` component. Also if you want to pass some additional props directly to the `useController` hook each of its props is available with `_controller` prefix eg. `_controllerRules`.

### `FormInput`

Basically it's a re-export of `FormInputBare` with predefined `control` props by subscribing to the `FormProvider` context by `useFormContext` hook.

`FormInput` share the same API as `FormInputBare` except the `control` prop which is omitted.

### Input factory

You might not want to pass `input` prop manually all the time over and over again.
Especially when you work in larger projects with a lot of forms.
Probably you have some kind of `Input` component that you use in your forms or that is coming from a UI library of your choice.

This is why we have a factory function that allows you to create a new component with predefined `input` prop.

## Usage

### Simple forms

```tsx
import { FormInput, FormInputBare } from "hookform-input";
import { useForm } from "react-hook-form";

const NameForm = () => {
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInputBare name="username" control={form.control} />
      <Button type="submit">Submit</Button>
    </form>
    // OR
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="username" />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};
```

### Factory

```tsx
type TestInputProps = {
  value?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // this will be still required
  randomProp: string;
};

const TestInput = ({ value, onChange, randomProp }: TestProps) => {
  return <input value={value} onChange={onChange} />;
};

const TestFormInput = createFormInput(TestInput)
const TestFormInputBare = createFormInputBare(TestInput)

// Usage
<TestFormInput<TestForm>
  randomProp="text"
  name="nest"
/>

<TestFormInputBare
  randomProp="text"
  name="nest"
  control={form.control}
/>

```
