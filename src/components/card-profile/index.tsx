/* eslint-disable @typescript-eslint/no-restricted-imports */
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/userSlice"
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react"
import { BASE_URL } from "../../constants"
import { FaRegArrowAltCircleRight } from "react-icons/fa"

const ProfileCard = () => {
  const current = useSelector(selectCurrent)

  if (!current) {
    return null
  }

  const { name, email, imageUrl, id } = current

  return (
    <Card className="py-4 w-[302px]">
      <Link to={`/users/${id}`}>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <Image
            alt="Card Profile"
            className="object-cover rounded-xl"
            src={`${BASE_URL}${imageUrl}`}
            width={370}
          />
        </CardHeader>
        <CardBody className="flex flex-row justify-between items-center">
          <div className="max-w-5/12">
            <h4 className="font-bold text-large mb-2">{name}</h4>
            <p className="text-default-500 flex items-center gap-2">{email}</p>
          </div>
          <FaRegArrowAltCircleRight size={25} />
        </CardBody>
      </Link>
    </Card>
  )
}

export default ProfileCard
