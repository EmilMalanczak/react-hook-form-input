import type {
  FieldError,
  FieldValues,
  Path,
  UseControllerReturn,
} from "react-hook-form";

import { getNestedValue } from "./get-nested-value";

export const getErrorFromController = <Form extends FieldValues>(
  controller: UseControllerReturn<Form, Path<Form>>,
  alternativeErrorKeys?: Path<Form>[],
) => {
  const { fieldState, formState } = controller;

  if (fieldState.error) return fieldState.error;

  if (alternativeErrorKeys) {
    for (const key of alternativeErrorKeys) {
      const value = getNestedValue(formState.errors, key) as
        | FieldError
        | undefined;

      if (value) return value;
    }
  }

  return undefined;
};
