/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useSelector } from "react-redux"
import { useState, type Key } from "react"
import { useParams } from "react-router-dom"
import { CiEdit, CiSquarePlus } from "react-icons/ci"
import { Button, Card, Image, useDisclosure } from "@nextui-org/react"

import { useGetAllCollectionsQuery } from "../../app/services/collectionApi"
import {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"

import { BASE_URL } from "../../constants"
import GoBack from "../../components/go-back"
import { hasError } from "../../utils/hasError"
import { selectCurrent } from "../../features/user/userSlice"
import EditProfile from "../../components/edit-profile"
import CollectionCard from "../../components/card-collection"
import CreateCollection from "../../components/create-collection"

const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const { data: userData } = useGetUserByIdQuery(id ?? "")
  const currentUser = useSelector(selectCurrent)
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()

  const { data: collData } = useGetAllCollectionsQuery()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: collectionIsOpenClosure,
    onOpen: collectionOnOpenClosure,
    onClose: collectionOnCloseClosure,
  } = useDisclosure()
  const [error, setError] = useState("")

  if (!collData) {
    return null
  }

  if (!userData) {
    return null
  }

  const handleClose = async () => {
    try {
      if (id) {
        await triggerGetUserByIdQuery(id)
        onClose()
      }
    } catch (error) {
      if (hasError(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  return (
    <div>
      <GoBack />
      <Card className="flex flex-row gap-10 space-y-4 p-5 flex-2 w-[50%] mb-10">
        <Image
          src={`${BASE_URL}${userData.imageUrl}`}
          alt={`${userData.name}`}
          width={200}
          height={200}
          className="border-4 border-white"
        />
        <div className="flex flex-col text-2xl font-bold gap-4 items-center">
          {userData.name}
          {currentUser?.id === id && (
            <Button endContent={<CiEdit />} onClick={() => onOpen()}>
              Edit profile
            </Button>
          )}
        </div>
      </Card>
      <div className="flex gap-5 flex-wrap mt-5">
        {currentUser?.id === id && (
          <div>
            <Card className="space-y-4 p-5">
              <button
                className="button"
                onClick={() => collectionOnOpenClosure()}
              >
                <CiSquarePlus size={150} />
                <span className="tooltip-text">Create collection</span>
              </button>
            </Card>
          </div>
        )}
        {collData
          ?.filter(collection => collection.author.id === id)
          .map(collection => {
            return (
              <div key={collection.id as Key}>
                <CollectionCard
                  id={collection.id}
                  name={collection.name}
                  imageUrl={collection.imageUrl}
                  categoryId={collection.categoryId}
                  authorId={collection.authorId}
                  forEdit={collection}
                />
              </div>
            )
          })}
      </div>
      <CreateCollection
        isOpen={collectionIsOpenClosure}
        onClose={collectionOnCloseClosure}
      />
      <EditProfile isOpen={isOpen} onClose={handleClose} user={userData} />
    </div>
  )
}

export default UserProfile
