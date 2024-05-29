import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import { NextUIProvider } from "@nextui-org/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme_provider"
import Auth from "./pages/auth"
import Layout from "./components/layout"
import UserProfile from "./pages/user-profile"
import Item from "./pages/item-page"
import CollectionPage from "./pages/collection-page"
import HomePage from "./pages/homepage"
import { AuthGuard } from "./features/user/authGuard"
import './i18n';

const container = document.getElementById("root")

const router = createBrowserRouter([
  { path: "/auth", element: <Auth /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "users/:id", element: <UserProfile /> },
      { path: "items", element: <Item /> },
      { path: "items/:id", element: <Item /> },
      { path: "collections", element: <CollectionPage /> },
      { path: "collections/:id", element: <CollectionPage /> },
    ],
  },
])

if (container) {
  const root = createRoot(container)

  root.render(
    <Provider store={store}>
      <NextUIProvider>
        <ThemeProvider>
          <AuthGuard>
            <RouterProvider router={router} />
          </AuthGuard>
        </ThemeProvider>
      </NextUIProvider>
    </Provider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
