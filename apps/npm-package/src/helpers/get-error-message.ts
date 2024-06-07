import type { FieldError } from "react-hook-form";

export const getErrorMessage = (error?: FieldError) => error?.message ?? null;
