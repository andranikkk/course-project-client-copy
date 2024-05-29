/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useParams } from "react-router-dom"
import { useGetCollectionByIdQuery } from "../../app/services/collectionApi"
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  useDisclosure,
} from "@nextui-org/react"
import GoBack from "../../components/go-back"
import ItemTable from "../../components/item-table/itemTable"
import { useGetAllItemsQuery } from "../../app/services/itemApi"
import { BASE_URL } from "../../constants"
import { CiSquarePlus } from "react-icons/ci"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/userSlice"
import CreateItem from "../../components/create-item"

const CollectionPage = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetCollectionByIdQuery(params?.id ?? "")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: items } = useGetAllItemsQuery()
  const currentUser = useSelector(selectCurrent)

  if (!items) {
    return null
  }

  const collsItems = items.filter(item => item.collectionId === params.id)

  if (!data) {
    return <h2>Collection does not exist</h2>
  }

  const {
    name,
    author,
    categoryId,
    createdAt,
    imageUrl,
    description,
    authorId,
  } = data

  return (
    <>
      <GoBack />
      <div className="flex flex-row gap-4">
        <Card className="py-4 w-[400px] h-[80vh]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
            <Image
              alt="Collection"
              className="object-cover rounded-xl"
              src={`${BASE_URL}${imageUrl}`}
              width={200}
            />
          </CardHeader>
          <CardBody className="font-bold text-large">
            <h4 className="mb-5">Name: {name}</h4>
            <p className="mb-5">Author: {author.name}</p>
            <p className="mb-5">Theme/Category: {categoryId}</p>
            <p className="mb-5">Description: {description}</p>
            <h4 className="mb-5">
              Created at: {new Date(createdAt).toLocaleDateString()}
            </h4>
            {currentUser?.id === authorId && (
              <Card className="p-1 flex items-center w-[70px]">
                <button className="button" onClick={() => onOpen()}>
                  <CiSquarePlus size={50} />
                </button>
              </Card>
            )}
          </CardBody>
        </Card>
        <ItemTable items={collsItems} />
        <CreateItem onClose={onClose} isOpen={isOpen} />
      </div>
    </>
  )
}

export default CollectionPage
