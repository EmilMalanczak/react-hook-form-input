import { AdapterObject, FormInputForwardedProps } from "./adapter-types";

export const DEFAULT_ADAPTER_KEY = "_default";

export const DEFAULT_ADAPTER: AdapterObject<FormInputForwardedProps> = {
  key: DEFAULT_ADAPTER_KEY,
  transformFn: (props) => props,
};
