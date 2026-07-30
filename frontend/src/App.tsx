import { BrowserRouter, useNavigate } from "react-router-dom";
import style from './css/App.module.css'
import LytRouter from "./router/LytRouter";
import { Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { GetMenuTree } from '../wailsjs/go/main/App'
type MenuItem = Required<MenuProps>['items'][number];

export default function App() {
    const [items, setItem] = useState<MenuItem[]>([])

    const [flag, setFlag] = useState<number>(0)

    // 暴露刷新菜单方法，传递给子组件MenuAdmin
    const flagUpdate = () => {
        setFlag(v => v + 1);
    };
    // 导航hook
    const nav = useNavigate()
    function jump(url: string) {
        nav(url)
    }


    useEffect(() => {
        async function loadMenu() {
            try {
                const e = await GetMenuTree();
                console.log(e);
                // 在这里赋值菜单数据
                setItem(e as MenuItem[])
            } catch (err) {
                console.error("加载菜单失败：缺少 sys_menus 数据表", err);
                // 可以给默认空菜单，避免页面异常
                setItem([])
            }
        }
        loadMenu();
    }, [flag])


    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        jump(e.key)
    };

    return <div className={style.main}>
        <div className={style.left}>
            <Menu
                onClick={onClick}
                style={{ width: 256 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </div>
        <div className={style.right}>
            <LytRouter flagUpdate={flagUpdate} />
        </div>
    </div>
}