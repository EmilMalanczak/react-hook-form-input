import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  createFormInput,
  createFormInputBare,
} from "../src/form-input-factory";

describe("Form input factory", () => {
  const InputComponent = (props: any) => (
    <input
      {...props}
      data-testid="factory-input"
      aria-invalid={!!props.error}
    />
  );

  describe("createFormInputBare", () => {
    it("renders correctly with input type", () => {
      const InputBare = createFormInputBare(InputComponent);

      const Component = () => {
        const { control } = useForm();

        return <InputBare name="test" control={control} />;
      };

      render(<Component />);

      expect(screen.getByTestId("factory-input")).toBeInTheDocument();
    });

    it("passes props correctly", () => {
      const InputBare = createFormInputBare(InputComponent);

      const Component = () => {
        const { control } = useForm({
          defaultValues: {
            test: "Some input value",
          },
          errors: {
            test: {
              message: "some error",
              type: "value",
            },
          },
        });

        return <InputBare name="test" control={control} id={2137} />;
      };

      render(<Component />);

      const input = screen.getByRole("textbox");

      expect(input).toHaveAttribute("name", "test");
      expect(input).toHaveAttribute("value", "Some input value");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("createFormInput", () => {
    it("renders correctly with input type", () => {
      const Input = createFormInput(InputComponent);

      const Component = () => {
        const form = useForm();

        return (
          <FormProvider {...form}>
            <Input name="test" />
          </FormProvider>
        );
      };

      render(<Component />);

      expect(screen.getByTestId("factory-input")).toBeInTheDocument();
    });

    it("passes props correctly", () => {
      const Input = createFormInput(InputComponent);

      const Component = () => {
        const form = useForm({
          defaultValues: {
            test: "Some input value",
          },
          errors: {
            test: {
              message: "some error",
              type: "value",
            },
          },
        });

        return (
          <FormProvider {...form}>
            <Input name="test" id={2137} />
          </FormProvider>
        );
      };

      render(<Component />);

      const input = screen.getByRole("textbox");

      expect(input).toHaveAttribute("name", "test");
      expect(input).toHaveAttribute("value", "Some input value");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });
});
