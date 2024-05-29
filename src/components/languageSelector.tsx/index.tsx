import type React from "react"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from "react-redux"
import { setLanguage } from "../../features/user/languageSlice"
import type { RootState } from "../../app/store"
import i18n from "../../i18n"

const LanguageSelector: React.FC = () => {
  const dispatch = useDispatch()
  const language = useSelector((state: RootState) => state.language.language)

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    dispatch(setLanguage(lang))
  }

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ru")}>Русский</button>
    </div>
  )
}

export default LanguageSelector
