import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { Suspense } from "react"
import { Skeleton } from "antd"

const LayoutSite = () => {
    return (
        <div>
            <Header></Header>
            <Suspense fallback={<Skeleton />}>
                <Outlet />
            </Suspense>
            <Footer></Footer>
        </div>

    )
}

export default LayoutSite