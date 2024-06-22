import { AdapterObject } from "./adapter-types";

export const DEFAULT_ADAPTER_KEY = "_default";

export const DEFAULT_ADAPTER: AdapterObject<{}> = {
  key: DEFAULT_ADAPTER_KEY,
  transformFn: ({ field, fieldState, formState, ...inputProps }) => inputProps,
};
