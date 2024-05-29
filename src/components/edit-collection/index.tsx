import type React from "react"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { ThemeContext } from "../theme_provider"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import type { Collection } from "../../app/types"
import { useEditCollectionMutation } from "../../app/services/collectionApi"
import ErrorMessage from "../errorMessage"
import CustomInput from "../custom-input"
import { hasError } from "../../utils/hasError"

type Props = {
  isOpen: boolean
  onClose: () => void
  collection?: Collection
  id?: string
}

const EditCollection: React.FC<Props> = ({ isOpen, onClose, collection, id }) => {
  const { theme } = useContext(ThemeContext)
  const [editCollection, { isLoading }] = useEditCollectionMutation()
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Collection>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: collection?.name,
      description: collection?.description,
      categoryId: collection?.categoryId,
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        console.log(id, 'collId from handlesubmit');
        
        await editCollection({
          id: id,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
        }).unwrap()
        // imageUrl: selectedFile,
        
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
            <ModalHeader className="flex flex-col gap-1">
              Edit collection
            </ModalHeader>
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
                  name="categoryId"
                  label="Category"
                  type="text"
                />
                <CustomInput
                  control={control}
                  name="description"
                  label="Description"
                  type="text"
                />
                <input
                  type="file"
                  name="imageUrl"
                  placeholder="Choose file"
                  onChange={handleChange}
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

export default EditCollection
