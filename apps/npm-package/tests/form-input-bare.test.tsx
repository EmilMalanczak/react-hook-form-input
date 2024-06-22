import { createRef } from "react";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FormInputBare } from "../src/form-input-bare";
import { renderWithUser } from "./render-with-user";

const mocks = vi.hoisted(() => ({
  useController: vi.fn(),
}));

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-hook-form")>();

  return {
    ...actual,
    useController: mocks.useController,
  };
});

describe("FormInputBare", () => {
  beforeEach(() => {
    mocks.useController.mockReturnValue({
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: "",
      },
      fieldState: {
        error: undefined,
      },
    });
  });

  it("renders with minimal props", () => {
    const { result } = renderHook(() => useForm());

    render(<FormInputBare name="test" control={result.current.control} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLInputElement>();

    const Component = () => {
      const { control } = useForm();

      return <FormInputBare name="test" control={control} ref={ref} />;
    };

    render(<Component />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("uses custom input component when provided", () => {
    const CustomInput = () => <input data-testid="custom-input" />;

    const Component = () => {
      const { control } = useForm();

      return (
        <FormInputBare name="test" input={CustomInput} control={control} />
      );
    };

    render(<Component />);

    expect(screen.getByTestId("custom-input")).toBeInTheDocument();
  });

  it("calls controller onChange and onBlur handlers", async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();

    mocks.useController.mockReturnValue({
      field: {
        onChange,
        onBlur,
        value: "",
      },
      fieldState: {
        error: undefined,
      },
    });

    const Component = () => {
      const { control } = useForm();

      return <FormInputBare name="test" control={control} />;
    };

    const { user } = renderWithUser(<Component />);

    const input = screen.getByRole("textbox");

    await user.type(input, "Some text");

    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it("calls onChange and onBlur props", async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();

    mocks.useController.mockReturnValue({
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: "",
      },
      fieldState: {
        error: undefined,
      },
    });

    const Component = () => {
      const { control } = useForm();

      return (
        <FormInputBare
          name="test"
          control={control}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    };

    const { user } = renderWithUser(<Component />);

    const input = screen.getByRole("textbox");

    await user.type(input, "Some text");

    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it("displays error message when error is present", async () => {
    mocks.useController.mockReturnValue({
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: "",
      },
      fieldState: {
        error: {
          message: "Error message",
        },
      },
    });

    const CustomInput = ({ error }: any) => <p>{error}</p>;

    const Component = () => {
      const { control } = useForm();

      return (
        <FormInputBare name="test" control={control} input={CustomInput} />
      );
    };

    render(<Component />);

    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("displays error message from alternativeErrorKeys when error is not present", async () => {
    mocks.useController.mockReturnValue({
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: "",
      },
      fieldState: {
        error: undefined,
      },
      formState: {
        errors: {
          alternativeError: {
            message: "Alternative error message",
          },
        },
      },
    });

    const CustomInput = ({ error }: any) => <p>{error}</p>;

    const Component = () => {
      const { control } = useForm();

      return (
        <FormInputBare
          name="test"
          control={control}
          input={CustomInput}
          alternativeErrorKeys={["alternativeError"]}
        />
      );
    };

    render(<Component />);

    expect(screen.getByText("Alternative error message")).toBeInTheDocument();
  });

  it("displays field error message when field error and alternative error is present", async () => {
    mocks.useController.mockReturnValue({
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: "",
      },
      fieldState: {
        error: { message: "Field error" },
      },
      formState: {
        errors: {
          alternativeError: {
            message: "Alternative error message",
          },
        },
      },
    });

    const CustomInput = ({ error }: any) => <p>{error}</p>;

    const Component = () => {
      const { control } = useForm();

      return (
        <FormInputBare
          name="test"
          control={control}
          input={CustomInput}
          alternativeErrorKeys={["alternativeError"]}
        />
      );
    };

    render(<Component />);

    expect(screen.getByText("Field error")).toBeInTheDocument();
  });

  it("should pass _controller prefixed props to useController and not forward them to input component", () => {
    const controllerProps = {
      _controllerDefaultValue: "default value",
      _controllerDisabled: true,
      _controllerRules: { required: true },
      _controllerShouldUnregister: true,
    };

    const CustomInput = (props: any) => (
      <div>
        {Object.keys(controllerProps).map((key) => (props.key ? key : null))}
      </div>
    );

    const Component = () => {
      const { control } = useForm();

      return (
        <FormInputBare
          name="test"
          control={control}
          input={CustomInput}
          {...controllerProps}
        />
      );
    };

    render(<Component />);

    expect(mocks.useController).toHaveBeenCalledWith(
      expect.objectContaining({
        rules: controllerProps._controllerRules,
        disabled: controllerProps._controllerDisabled,
        defaultValue: controllerProps._controllerDefaultValue,
        shouldUnregister: controllerProps._controllerShouldUnregister,
      }),
    );

    Object.keys(controllerProps).forEach((key) => {
      expect(screen.queryByText(key)).not.toBeInTheDocument();
    });
  });

  it("logs informations to the console on each change while in debug mode", async () => {
    mocks.useController.mockReturnValue({
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: "",
      },
      fieldState: {
        error: undefined,
      },
    });

    const consoleSpy = vi.spyOn(console, "info");

    const Component = () => {
      const { control } = useForm();

      return <FormInputBare name="test" control={control} debug />;
    };

    const { user } = renderWithUser(<Component />);

    const input = screen.getByRole("textbox");

    const typedText = "Some text";
    await user.type(input, typedText);

    waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledTimes(typedText.length);
    });
  });
});
