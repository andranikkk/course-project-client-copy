import type React from "react"
import { useContext, useState } from "react"
import type { User } from "../../app/types"
import { useUpdateUserMutation } from "../../app/services/userApi"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import CustomInput from "../input"
import { MdOutlineEmail } from "react-icons/md"
import { ThemeContext } from "../theme_provider"
import { hasError } from "../../utils/hasError"
import ErrorMessage from "../errorMessage"

type Props = {
  isOpen: boolean
  onClose: () => void
  user?: User
}

const EditProfile: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const { id } = useParams<{ id: string }>()
  const { theme } = useContext(ThemeContext)
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: user?.email,
      name: user?.name,
    },
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()
        data.name && formData.append("name", data.name)
        data.email &&
          data.email !== user?.email &&
          formData.append("email", data.email)
        selectedFile && formData.append("avatar", selectedFile)

        await updateUser({ userData: formData, id }).unwrap()
        onClose()
      } catch (error) {
        if (hasError(error)) {
          setError(error.data.error)
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit profile
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <CustomInput
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  endContent={<MdOutlineEmail />}
                />
                <CustomInput
                  control={control}
                  name="name"
                  label="Name"
                  type="text"
                />
                <input
                  type="file"
                  name="imageUrl"
                  placeholder="Choose file"
                  onChange={handleProfileChange}
                />
                <ErrorMessage error={error} />
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default EditProfile
