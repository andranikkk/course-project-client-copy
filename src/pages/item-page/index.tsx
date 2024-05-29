import {
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useLazyGetItemByIdQuery,
} from "../../app/services/itemApi"
import ItemTable from "../../components/item-table/itemTable"
import GoBack from "../../components/go-back"
import { Link, useParams } from "react-router-dom"
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react"
import Typography from "../../components/typography"
import { BASE_URL } from "../../constants"
import { hasError } from "../../utils/hasError"
import { useState } from "react"
import { DeleteIcon } from "../../components/item-table/deleteIcon"
import { useDeleteCommentMutation } from "../../app/services/commentApi"

const ItemPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: items } = useGetAllItemsQuery()
  const [triggerItemByIdQuery] = useLazyGetItemByIdQuery()
  const { data: itemForComments } = useGetItemByIdQuery(id ?? "")
  const [deleteComment] = useDeleteCommentMutation()
  const [error, setError] = useState("")

  if (!items) {
    return null
  }

  if (!itemForComments) {
    return null
  }

  const itemById = items.filter(item => item.id === id)

  const refetchData = async () => {
    await triggerItemByIdQuery(id ?? "").unwrap()
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id).unwrap()
      await refetchData()
    } catch (error) {
      if (hasError(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  return (
    <>
      <GoBack />
      <ItemTable items={itemById} likedByUser={itemForComments.likedByUser} />
      <Typography>Comments: </Typography>
      <Card className="max-w-[100vh]">
        {itemForComments.Comment.map(comment => {
          return (
            <CardBody key={comment.id}>
              <Card className="py-4 w-full mb-5">
                <CardHeader className="justify-between items-center bg-transparent">
                  <Link
                    to={`/users/${comment.userId}`}
                    className="flex items-center"
                  >
                    <Image
                      src={`${BASE_URL}${comment.user.imageUrl}`}
                      alt={`${comment.user.name}`}
                      width={50}
                      className="rounded-full"
                    />
                    <p className="ml-3">{comment.user.name}</p>
                  </Link>
                </CardHeader>
                <Typography>{comment.content}</Typography>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                  <DeleteIcon />
                </button>
              </Card>
            </CardBody>
          )
        })}
      </Card>
    </>
  )
}

export default ItemPage
