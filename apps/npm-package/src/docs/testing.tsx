import { TextInput, Checkbox, CheckboxGroup, Group } from "@mantine/core"
import { useRef } from "react"
import { ControllerFieldState, useForm } from "react-hook-form"

import { FormInput } from "../form-input"
import { FormInputBare } from "../form-input-bare"
import { createFormInput } from "../form-input-factory"

type TestProps = {
  value?: number
  onChange: (n: number) => void
  fieldState?: ControllerFieldState
  randomProp: string
}

type TestForm = {
  name: string
  password: string
  nest: {
    test: string
    x: string[]
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestInput = ({ value, fieldState, onChange, randomProp }: TestProps) => {
  return <div>x</div>
}

const MantineFormInput = createFormInput(TextInput)
const MantineCheckboxGroupInput = createFormInput(Checkbox.Group)

const Test = () => {
  const { control } = useForm<TestForm>({
    defaultValues: {
      name: "Test",
      password: "password",
      nest: {
        test: "test",
        x: ["string"]
      }
    }
  })
  const inputref = useRef<HTMLInputElement>(null)

  const x = () => {
    inputref.current?.focus()
  }

  const onCheckboxChange = (values: string[]) => {
    console.log(values)
    // formData.setValue('roles', newValue ? [newValue] : []);
  }

  return (
    <>
      <FormInputBare<TestForm, "div">
        name="name"
        input="select"
        ref={inputref}
        control={control}
      />
      <FormInputBare
        name="name"
        input={TextInput}
        mx={2}
        ref={inputref}
        control={control}
      />
      <FormInputBare href="/" input="a" name="nam2e" control={control} />
      <FormInputBare input="div" href="/" />

      <FormInputBare
        input={TestInput}
        randomProp={2}
        control={control}
        name="name"
      />

      <FormInput input={TestInput} randomProp="sdsad" name="nest" />

      <FormInput input={Checkbox} name="aaa" ref={inputref} mx={2} />
      <FormInput<TestForm, typeof Checkbox>
        input={Checkbox}
        name="aaa"
        ref={inputref}
        mx={2}
      />

      <FormInput<TestForm, typeof TextInput>
        input={TextInput}
        name="name"
        control={control}
        mx={2}
        onChange={(e) => {
          console.log(e)
        }}
        ref={inputref}
        alternativeErrorKeys={["d"]}
      />

      <FormInput<TestForm>
        input={TextInput}
        name="name"
        control={control}
        mx={2}
        ref={inputref}
      />

      <FormInput
        input={TextInput}
        name="namex"
        alternativeErrorKeys={["d"]}
        // control={control}
        mx={2}
        ref={inputref}
      />
      <FormInput input="div" randomProp="s" name="name" />

      <MantineFormInput<TestForm>
        name="field.name"
        mx={2}
        ref={inputref}
      />

      <FormInput<TestForm, typeof Checkbox.Group>
        input={Checkbox.Group}
        name="roles"
        label="label"
        required
        onChange={onCheckboxChange}>
        <Group>
          <Checkbox value="ROLE_COMPANY_USER" label="PCF" />
          <Checkbox value="ROLE_GLOBAL_ADMIN" label="Admin" />
        </Group>
      </FormInput>

      <MantineCheckboxGroupInput<TestForm>
        name="roles"
        label="label"
        required
        onChange={onCheckboxChange}>
        <Group>
          <Checkbox value="ROLE_COMPANY_USER" label="PCF" />
          <Checkbox value="ROLE_GLOBAL_ADMIN" label="Admin" />
        </Group>
      </MantineCheckboxGroupInput>

      <Flex direction="column" justify="center">
        {fields.map((field, index) => (
          <FormInput
            key={field._id}
            label={index === 0 && t("label.production_locations")}
            required={index === 0}
            component={TextInput}
            placeholder={t("label.nextLocation")}
            rightSection={
              index > 2 && (
                <ActionIcon
                  variant="transparent"
                  onClick={() => openConfirmationModal(index)}>
                  <DeleteIcon size={16} />
                </ActionIcon>
              )
            }
            {...register(`locations.${index}.name`)}
          />
        ))}
      </Flex>

      {companyPcdReasonFields.map((field, index) => (
        <FormInput
          key={field._id}
          defaultChecked={field.value}
          name={`calculationReasonQuestions.${index}.value`}
          component={Checkbox}
          label={
            <Text fw="300">
              {checkIsEmissionDictionaryTranslateKey(field.code)
                ? td(field.code)
                : field.name}
            </Text>
          }
        />
      ))}

      <FormInput
        component={Select}
        name="industryId"
        label={t("label.industry")}
        placeholder={t("label.select_your_industry")}
        required
        data={industries.map((item) => {
          return {
            label: checkIsEmissionDictionaryTranslateKey(item.code)
              ? td(item.code)
              : item.name,
            value: item.id.toString()
          }
        })}
      />
      <FormInput
        component={DateInput}
        name="to"
        label={accountingPeriodLabel}
        required
        leftSectionLabel={`${t("label.to")}:`}
      />
      {/* {companySizeFields.map((field, index) => ( */}
      {/* date input.tsx */}
      {/* SupplyForm SearchSupplierField */}
    </>
  )
}
