import { Button } from "@nextui-org/react"
import type React from "react"

type Props = {
  children: React.ReactNode
  icon?: JSX.Element
  className?: string
  type?: "button" | "submit" | "reset"
  fullWidth?: boolean
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined
}

const CustomButton: React.FC<Props> = ({
  children,
  icon,
  className,
  type,
  color,
  fullWidth,
}) => {
  return (
    <Button
      startContent={icon}
      size="lg"
      color={color}
      variant="light"
      className={className}
      type={type}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  )
}

export default CustomButton
