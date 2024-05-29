import type React from "react"
import CustomButton from "../button"
import { Link } from "react-router-dom"

type Props = {
  children: React.ReactNode
  icon: JSX.Element
  href: string
}

const NavButton: React.FC<Props> = ({ children, icon, href }) => {
  return (
    <CustomButton className="flex justify-start text-xl" icon={icon}>
      <Link to={href}>{children}</Link>
    </CustomButton>
  )
}

export default NavButton
