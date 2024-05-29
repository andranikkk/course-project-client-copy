import { useState } from "react"
import type React from "react"
import { useParams } from "react-router-dom"
import { IoMdCreate } from "react-icons/io"
import { Button, Textarea } from "@nextui-org/react"
import { Controller, useForm } from "react-hook-form"

import ErrorMessage from "../errorMessage"
import { hasError } from "../../utils/hasError"
import { useCreateCommentMutation } from "../../app/services/commentApi"
import { useLazyGetItemByIdQuery } from "../../app/services/itemApi"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateComment: React.FC<Props> = ({ isOpen, onClose }) => {
  const [createComment] = useCreateCommentMutation()
  const [triggerItemByIdQuery] = useLazyGetItemByIdQuery()
  const { id } = useParams<{ id: string }>()
  const [errorState, setErrorState] = useState("")

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        await createComment({ content: data.comment, itemId: id }).unwrap()
        setValue("comment", "")
        await triggerItemByIdQuery(id).unwrap()
        onClose()
      }
    } catch (error) {
      if (hasError(error)) {
        setErrorState(error.data.error)
      }
    }
  })

  const error = errors?.item?.message as string

  return (
    <div>
      {isOpen && (
        <form onSubmit={onSubmit} className="flex-grow">
          <Controller
            name="comment"
            control={control}
            defaultValue=""
            rules={{
              required: "Field must be filled",
            }}
            render={({ field }) => (
              <Textarea
                {...field}
                labelPlacement="outside"
                placeholder="Write your comment"
                className="mb-5"
              />
            )}
          />

          {errors && <ErrorMessage error={error} />}

          <Button
            color="primary"
            className="flex-end mb-4"
            endContent={<IoMdCreate />}
            type="submit"
          >
            Publish
          </Button>
        </form>
      )}
    </div>
  )
}

export default CreateComment
