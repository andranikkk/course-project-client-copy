/* eslint-disable @typescript-eslint/no-restricted-imports */
import type React from "react"
import { useContext } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import { ThemeContext } from "../theme_provider"
import ErrorMessage from "../errorMessage"
import {
  useCreateItemMutation,
  useLazyGetAllItemsQuery,
} from "../../app/services/itemApi"
import { useParams } from "react-router-dom"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateItem: React.FC<Props> = ({ isOpen, onClose }) => {
  const { id } = useParams<{ id: string }>()
  const { theme } = useContext(ThemeContext)
  const [createItem] = useCreateItemMutation()
  const [triggerGetAllItemsQuery] = useLazyGetAllItemsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  if (!id) {
    return null
  }

  const handleCreate = handleSubmit(async data => {
    try {
      await createItem({
        name: data.name,
        tags: data.tags,
        collectionId: id,
        categoryId: data.categoryId,
        content: data.content,
      }).unwrap()
      setValue("item", "")
      triggerGetAllItemsQuery()
      onClose()
    } catch (error) {
      console.log(error, "error while creating collection")
    }
  })

  const error = errors?.collection?.message as string

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">New item:</ModalHeader>
            <ModalBody>
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={handleCreate}
              >
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <Input {...field} label="Name" type="text" />
                  )}
                />
                {errors.name && <ErrorMessage error={error} />}
                <Controller
                  name="tags"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tag is required" }}
                  render={({ field }) => (
                    <Input {...field} label="Tags" type="text" />
                  )}
                />
                {errors.name && <ErrorMessage error={error} />}
                <Controller
                  name="categoryId"
                  control={control}
                  defaultValue=""
                  rules={{ required: "categoryId is required" }}
                  render={({ field }) => (
                    <Input {...field} label="categoryId" type="text" />
                  )}
                />
                {errors.name && <ErrorMessage error={error} />}
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  rules={{ required: "content is required" }}
                  render={({ field }) => (
                    <Input {...field} label="content" type="text" />
                  )}
                />
                {errors.name && <ErrorMessage error={error} />}

                <Button type="submit" color="primary" fullWidth>
                  Create
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CreateItem
