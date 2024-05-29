/* eslint-disable @typescript-eslint/no-restricted-imports */
import type React from "react"
import { useContext } from "react"
import type { FieldValues } from "react-hook-form"
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
import {
  useCreateCollectionMutation,
  useLazyGetAllCollectionsQuery,
} from "../../app/services/collectionApi"
import ErrorMessage from "../errorMessage"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateCollection: React.FC<Props> = ({ isOpen, onClose }) => {
  const [triggerGetAllCollections] = useLazyGetAllCollectionsQuery()
  const { theme } = useContext(ThemeContext)
  const [createCollection] = useCreateCollectionMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const handleCreate = handleSubmit(async (data: FieldValues) => {
    try {
      await createCollection({
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
      }).unwrap()
      setValue("collection", "")
      triggerGetAllCollections()
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
            <ModalHeader className="flex flex-col gap-1">
              New collection:
            </ModalHeader>
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
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <Input {...field} label="Description" type="text" />
                  )}
                />
                {errors.description && <ErrorMessage error={error} />}

                <Controller
                  name="categoryId"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Input {...field} label="Category" type="text" />
                  )}
                />
                {errors.categoryId && <ErrorMessage error={error} />}

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

export default CreateCollection
