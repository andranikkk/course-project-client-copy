/* eslint-disable @typescript-eslint/no-restricted-imports */
import type { Key } from "react"
import { CiEdit } from "react-icons/ci"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react"

import { useGetAllItemsQuery } from "../../app/services/itemApi"
import { selectCurrent } from "../../features/user/userSlice"
import { BASE_URL } from "../../constants"

type Props = {
  id: String
  name: String
  categoryId: String
  tags?: String
  userId?: String
  authorImg?: String | undefined
  authorName?: String | undefined
}

const ItemCard: React.FC<Props> = ({
  id,
  name,
  categoryId,
  userId,
  tags,
  authorImg,
  authorName,
}) => {
  const { id: authorParam } = useParams()
  const currentUser = useSelector(selectCurrent)
  const navigate = useNavigate()

  return (
    <Card className="py-4 w-[295px]" key={id as Key}>
      <Card
        className="py-4 w-[302px]"
        key={id as Key}
        isPressable
        onPress={() => navigate(`/items/${id}`)}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          {tags}
        </CardHeader>
        <CardBody>
          <h4 className="font-bold text-large mb-2">{name}</h4>
          <p className="text-default-500 flex items-center gap-2">
            {categoryId}
          </p>
        </CardBody>
      </Card>
      {userId !== authorParam ? (
        <CardHeader className="justify-between items-center bg-transparent">
          <Link to={`/users/${userId}`} className="flex items-center">
            <Image
              src={`${BASE_URL}${authorImg}`}
              alt={`${name}`}
              width={50}
              className="rounded-full mr-3"
            />
            <p>{authorName}</p>
          </Link>
        </CardHeader>
      ) : currentUser?.id === authorParam ? (
        <Button endContent={<CiEdit />}>Edit</Button>
      ) : (
        ""
      )}
    </Card>
  )
}

export default ItemCard
