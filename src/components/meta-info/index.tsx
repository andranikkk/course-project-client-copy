import type React from "react"
import type { IconType } from "react-icons/lib"

type Props = {
  count: number
  Icon: IconType
}

const MetaInfo: React.FC<Props> = ({ count, Icon }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <p className="text-default-500 text-xl hover:text-2xl ease-in duration-100">
        <Icon size={30} />
      </p>
      {count > 0 && (
        <p className="font-semibold text-default-500 text-l">{count}</p>
      )}
    </div>
  )
}

export default MetaInfo
