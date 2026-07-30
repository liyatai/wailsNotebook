import { lazy, useEffect } from "react";
import { RouteObject, useRoutes, useParams, useNavigate } from "react-router-dom";
import { GetMenuIdByPath } from "../../wailsjs/go/main/App";

const Setting = lazy(() => import('../page/Setting'))
const Analysis = lazy(() => import('../page/Analysis'))
const DataAdmin = lazy(() => import('../page/DataAdmin'))
const ShowPanel = lazy(() => import('../page/ShowPanel'))
const Delete = lazy(() => import('../page/Delete'))
const MenuAdmin = lazy(() => import('../page/MenuMange'))

// 动态路由捕获组件
const DynamicRouteHandler = () => {
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const resolveRoute = async () => {
            try {
                const fragment = params["*"];
                if (!fragment) {
                    navigate("/");
                    return;
                }
                const fullPath = `/${fragment}`;
                const menuId = await GetMenuIdByPath(fullPath);
                if (menuId > 0) {
                    navigate(`/show?menuId=${menuId}`);
                } else {
                    navigate("/");
                }
            } catch (err) {
                navigate("/");
            }
        };
        resolveRoute();
    }, [params, navigate]);

    return null;
};

export default function LytRouter({flagUpdate}:{flagUpdate:()=>void}) {
    const staticRoute: RouteObject[] = [
        { path: "/setting", element: <Setting /> },
        { path: "/", element: <Analysis /> },
        { path: "/dataAdmin/add", element: <DataAdmin /> },
        { path: "/show", element: <ShowPanel /> },
        { path: "/dataAdmin/delete", element: <Delete /> },
        { path: "/dataAdmin/menuAdmin", element: <MenuAdmin flagUpdate={flagUpdate} /> },
        // 通配路由必须放在数组最后！
        { path: "/*", element: <DynamicRouteHandler /> },
    ]
    return <div>
        {useRoutes(staticRoute)}
    </div>
}