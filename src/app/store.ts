import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { api } from "./services/api"
import userSlice from "../features/user/userSlice"
import { listenMiddleware } from "../middlewares/auth"
import languageReducer from "../features/user/languageSlice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    userSlice,
    language: languageReducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware()
      .concat(api.middleware)
      .prepend(listenMiddleware.middleware)
  },
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
