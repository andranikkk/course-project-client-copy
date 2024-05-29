import { Outlet } from "react-router-dom"

import Header from "../header"
import Container from "../container"

const Layout = () => {
  return (
    <>
      <Header />
      <Container>
        <div className="flex-1 p-5">
          <Outlet />
        </div>
      </Container>
    </>
  )
}

export default Layout
