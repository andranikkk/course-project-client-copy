import type React from "react"
import { useForm } from "react-hook-form"
import CustomInput from "../../components/input"
import { Button, Link } from "@nextui-org/react"
import { useLazyCurrentQuery, useLoginMutation } from "../../app/services/userApi"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { hasError } from "../../utils/hasError"
import ErrorMessage from "../../components/errorMessage"

type Props = {
  setSelected: (value: string) => void
}

type LoginType = {
  email: string
  password: string
}

const Login: React.FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [triggerCurrentQuery] = useLazyCurrentQuery()

  const onSubmit = async (data: LoginType) => {
    try {
      await login(data).unwrap()
      await triggerCurrentQuery().unwrap()
      navigate("/")
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
        name="password"
        label="Password"
        type="password"
        required="Required field!"
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        No account?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("sign-up")}
        >
          Sign up
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </div>
    </form>
  )
}

export default Login
