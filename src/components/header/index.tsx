/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { CiLogin, CiLogout } from "react-icons/ci"
import { FaRegMoon } from "react-icons/fa"
import { LuSunMedium } from "react-icons/lu"
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"

import { ThemeContext } from "../theme_provider"
import { logout, selectIsAuthenticated } from "../../features/user/userSlice"
import type { RootState } from "../../app/store"
import i18n from "../../i18n"
import LanguageSelector from "../languageSelector.tsx"

const Header = () => {
  const language = useSelector((state: RootState) => state.language.language)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <Navbar>
      <LanguageSelector />
      <NavbarBrand>
        <p className="font-bold text-inherit"></p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem
          onClick={() => toggleTheme()}
          className="lg:flex text-exl cursor-pointer"
        >
          {theme === "light" ? <FaRegMoon /> : <LuSunMedium />}
        </NavbarItem>
        {isAuthenticated ? (
          <NavbarItem className="cursor-pointer ml-5">
            <Button
              color="default"
              variant="flat"
              className="gap-2"
              onClick={handleLogout}
            >
              <span>Log out</span> <CiLogout />
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem className="cursor-pointer ml-5">
            <Button
              color="default"
              variant="flat"
              className="gap-2"
              onClick={() => navigate("/auth")}
            >
              <span>Login / Register</span> <CiLogin />
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default Header
