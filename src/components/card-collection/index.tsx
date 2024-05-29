/* eslint-disable @typescript-eslint/no-restricted-imports */
import type React from "react"
import { useState, type Key } from "react"
import { CiEdit } from "react-icons/ci"
import { useSelector } from "react-redux"
import { RiDeleteBinLine } from "react-icons/ri"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  useDisclosure,
  User,
} from "@nextui-org/react"

import { BASE_URL } from "../../constants"
import { selectCurrent } from "../../features/user/userSlice"
import type { Collection } from "../../app/types"
import {
  useDeleteCollectionMutation,
  useLazyGetAllCollectionsQuery,
  useLazyGetCollectionByIdQuery,
} from "../../app/services/collectionApi"
import { hasError } from "../../utils/hasError"
import EditCollection from "../edit-collection"
import { useGetAllItemsQuery } from "../../app/services/itemApi"
import ItemTable from "../item-table/itemTable"

type Props = {
  id: string
  name: string
  categoryId: string
  authorId?: string
  imageUrl?: string | undefined
  authorImg?: string | undefined
  authorName?: string | undefined
  createdAt?: Date
  forEdit: Collection
}

const CollectionCard: React.FC<Props> = ({
  id,
  imageUrl,
  name,
  categoryId,
  authorId,
  authorImg,
  createdAt,
  authorName,
  forEdit,
}) => {
  const { id: authorParam } = useParams<{ id: string }>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const currentUser = useSelector(selectCurrent)
  const [deleteCollection] = useDeleteCollectionMutation()
  const [triggerGetAllCollections] = useLazyGetAllCollectionsQuery()
  const { data: itemData } = useGetAllItemsQuery()
  const [triggerGetCollectionByIdQuery] = useLazyGetCollectionByIdQuery()

  const collsItems = itemData?.filter(item => item.collection.id === id)

  const refetchData = async () => {
    await triggerGetAllCollections().unwrap()
  }

  const handleDelete = async () => {
    try {
      await deleteCollection(id).unwrap()
      await refetchData()
    } catch (error) {
      if (hasError(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  const handleClose = async () => {
    if (id) {
      try {
        refetchData()
        onClose()
      } catch (error) {
        if (hasError(error)) {
          setError(error.data.error)
        } else {
          setError(error as string)
        }
      }
    }
  }

  return (
    <Card className="py-4 min-w-[500px]" key={id as Key}>
      {authorId !== authorParam ? (
        <CardHeader className="justify-between items-center bg-transparent">
          <Link to={`/users/${authorId}`} className="flex items-center">
            <User
              name={authorName}
              className="text-small font-semibold leading-none text-default-600"
              avatarProps={{ src: `${BASE_URL}${authorImg}` }}
              description={
                createdAt && new Date(createdAt).toLocaleDateString()
              }
            />
          </Link>
        </CardHeader>
      ) : currentUser?.id === authorParam ? (
        <div className="flex justify-around mb-5">
          <Button endContent={<CiEdit />} onClick={onOpen}>
            Edit
          </Button>
          <Button endContent={<RiDeleteBinLine />} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      ) : (
        ""
      )}
      <Card className="pb-0 pt-2 px-4 flex-row flex h-full cursor-pointer">
        <CardBody
          className="max-w-[200px]"
          onClick={() => navigate(`/collections/${id}`)}
        >
          <h4 className="font-bold text-large mb-2">{name}</h4>
          <p className="text-default-500 flex items-center gap-2">
            {categoryId}
          </p>
          <Image
            alt="Collection avatar"
            className="object-cover rounded-xl"
            src={`${BASE_URL}${imageUrl}`}
            width={130}
          />
        </CardBody>
        {authorParam && collsItems && (
          <CardBody className="pb-0 pt-2 px-4 flex-row flex h-full min-w-[790px]">
            <ItemTable items={collsItems} />
          </CardBody>
        )}
      </Card>
      <EditCollection
        isOpen={isOpen}
        onClose={handleClose}
        collection={forEdit}
        id={id}
      />
    </Card>
  )
}
export default CollectionCard
