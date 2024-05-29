import type React from "react"
import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { Item } from "../../app/types"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import CustomInput from "../input"
import ErrorMessage from "../errorMessage"
import { ThemeContext } from "../theme_provider"
import { hasError } from "../../utils/hasError"
import { useEditItemMutation } from "../../app/services/itemApi"

type Props = {
  isOpen: boolean
  onClose: () => void
  item?: Item
}

const EditItem: React.FC<Props> = ({ isOpen, onClose, item }) => {
  const { id } = useParams<{ id: string }>()
  const [editItem, { isLoading }] = useEditItemMutation()
  const { theme } = useContext(ThemeContext)
  const [error, setError] = useState("")

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Item>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: item?.name,
      tags: item?.tags,
      categoryId: item?.categoryId,
    },
  })

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        await editItem({
          id: id,
          name: data.name,
          categoryId: data.categoryId,
          tags: data.tags,
        }).unwrap()

        onClose()
      }
    } catch (error) {
      if (hasError(error)) {
        setError(error.data.error)
      }
    }
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit item</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <CustomInput
                  control={control}
                  name="name"
                  label="Name"
                  type="text"
                />
                <CustomInput
                  control={control}
                  name="tags"
                  label="tags"
                  type="text"
                />
                <CustomInput
                  control={control}
                  name="categoryId"
                  label="Category"
                  type="text"
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

export default EditItem
