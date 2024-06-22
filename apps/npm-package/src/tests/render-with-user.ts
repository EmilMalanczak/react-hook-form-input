import type { RenderOptions } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import { ReactElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const renderWithUser = (
  ui: ReactElement,
  renderOptions: RenderOptions = {},
): ReturnType<typeof render> & {
  user: UserEvent;
} => {
  const user = userEvent.setup();

  const result = render(ui, renderOptions);

  return {
    ...result,
    user,
  };
};
