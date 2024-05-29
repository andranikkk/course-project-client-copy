/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-restricted-imports */
import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { EditIcon } from "../../components/item-table/editIcon"
import { DeleteIcon } from "../../components/item-table/deleteIcon"

import type { Item } from "../../app/types"

import { BASE_URL } from "../../constants"
import { useNavigate, useParams } from "react-router-dom"
import {
  useDeleteItemMutation,
  useLazyGetAllItemsQuery,
} from "../../app/services/itemApi"
import { hasError } from "../../utils/hasError"
import { FaRegArrowAltCircleRight } from "react-icons/fa"
import { IoMdCreate } from "react-icons/io"
import CreateComment from "../create-comment"
import MetaInfo from "../meta-info"
import { FcDislike } from "react-icons/fc"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import {
  useLikeItemMutation,
  useUnlikeItemMutation,
} from "../../app/services/likeApi"
import EditItem from "../edit-item"

type Props = {
  items: Item[]
  likedByUser?: boolean
}

const ItemTable: React.FC<Props> = ({ items, likedByUser = false }) => {
  const navigate = useNavigate()
  const { id: itemParam } = useParams<{ id: string }>()
  const [error, setError] = useState("")
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [deleteItem] = useDeleteItemMutation()
  const [triggerGetAllItems] = useLazyGetAllItemsQuery()
  const [likeItem] = useLikeItemMutation()
  const [unlikeItem] = useUnlikeItemMutation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const refetchData = async () => {
    await triggerGetAllItems().unwrap()
  }

  const handleLike = async (id: string) => {
    try {
      if (likedByUser) {
        await unlikeItem(id).unwrap()
      } else {
        await likeItem({ itemId: id }).unwrap()
      }

      refetchData()
    } catch (error) {
      if (hasError(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  const handleCloseEdit = async () => {
    if (itemParam) {
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

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id).unwrap()
      await refetchData()
      navigate(-1)
    } catch (error) {
      if (hasError(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  const handleClose = () => {
    setIsFormVisible(false)
    refetchData()
  }

  const columns = [
    { uid: "name", name: "Name" },
    { uid: "tags", name: "Tags" },
    { uid: "collection", name: "Collection" },
    { uid: "categoryId", name: "Category" },
    { uid: "createdAt", name: "Created At" },
    { uid: "user", name: "User" },
    { uid: "actions", name: "Actions" },
  ]

  const renderCell = React.useCallback((item: Item, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return item.name
      case "tags":
        return item.tags
      case "collection":
        return item.collection.name
      case "categoryId":
        return item.categoryId
      case "createdAt":
        return new Date(item.createdAt).toLocaleDateString()
      case "user":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `${BASE_URL}${item.user.imageUrl}`,
            }}
            description={item.user.email}
            name={item.user.name}
          />
        )
      case "actions":
        return (
          <>
            {itemParam === item.id ? (
              <div className="flex flex-row">
                <Button
                  color="success"
                  endContent={<IoMdCreate />}
                  onClick={() => setIsFormVisible(!isFormVisible)}
                >
                  Comment
                </Button>
                <Tooltip content="Edit item">
                  <button
                    onClick={() => onOpen()}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  >
                    <EditIcon />
                  </button>
                </Tooltip>
                <Tooltip color="danger" content="Delete item">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                  >
                    <DeleteIcon />
                  </button>
                </Tooltip>
                <button onClick={() => handleLike(item.id)} className="ml-3">
                  <MetaInfo
                    count={item.Like.length}
                    Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                  />
                </button>
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate(`/items/${item.id}`)}>
                <FaRegArrowAltCircleRight size={20} />
              </Button>
            )}
          </>
        )
    }
  }, [])

  return (
    <>
      {items && (
        <Table className="mb-4" aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {column => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items || []}>
            {item => (
              <TableRow key={item.id}>
                {columnKey => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <EditItem isOpen={isOpen} onClose={handleCloseEdit} item={items[0]} />
      <CreateComment isOpen={isFormVisible} onClose={handleClose} />
    </>
  )
}

export default ItemTable
