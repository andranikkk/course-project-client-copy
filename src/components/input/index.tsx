import { Input } from "@nextui-org/react"
import type React from "react"
import type { Control } from "react-hook-form"
import { useController } from "react-hook-form"

type Props = {
  name: string
  label: string
  placeholder?: string
  type?: string
  control: Control<any>
  required?: string
  endContent?: JSX.Element
}

const CustomInput: React.FC<Props> = ({
  control,
  label,
  name,
  endContent,
  placeholder,
  required = "",
  type,
}) => {
  const {
    field,
    formState: { errors },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules: {
      required,
    },
  })

  return (
    <Input
      id={name}
      label={label}
      type={type}
      placeholder={placeholder}
      value={field.value}
      name={field.name}
      isInvalid={invalid}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={`${errors[name]?.message ?? ""}`}
    />
  )
}

export default CustomInput
