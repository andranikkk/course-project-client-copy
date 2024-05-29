import type React from "react"
import { useForm } from "react-hook-form"
import CustomInput from "../../components/input"
import { Button, Link } from "@nextui-org/react"
import {
  useRegisterMutation,
} from "../../app/services/userApi"
import { useState } from "react"
import { hasError } from "../../utils/hasError"
import ErrorMessage from "../../components/errorMessage"

type Props = {
  setSelected: (value: string) => void
}

type RegisterType = {
  email: string
  name: string
  password: string
}

const Register: React.FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  })

  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState("")

  const onSubmit = async (data: RegisterType) => {
    try {
      await register(data).unwrap()
    } catch (error) {
      // console.error(error, "Login error")
      if (hasError(error)) {
        setError(error.data.error)
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Required field!"
      />
      <CustomInput
        control={control}
        name="name"
        label="Name"
        type="text"
        required="Required field!"
      />
      <CustomInput
        control={control}
        name="password"
        label="Password"
        type="password"
        required="Required field!"
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        Already have an account?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          Log in
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Sign up
        </Button>
      </div>
    </form>
  )
}

export default Register
