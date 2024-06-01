import type { FieldErrors, FieldValues, Path } from "react-hook-form"

import { GetFieldType } from "./get-nested-value"

export const getErrorMessage = <V extends FieldValues>(
  // any comes from library typings
  error?: GetFieldType<FieldErrors<V>, Path<V>>
  //   @ts-expect-error- idk
) => error?.message.toString() || ""
