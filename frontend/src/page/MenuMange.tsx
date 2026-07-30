import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select, Button, message, Collapse, Modal, Form, Input } from "antd";
import { GetFirstLevelMenuOption, GetSecondLevelMenuOption, DeleteMenuById, AddSysMenu } from "../../wailsjs/go/main/App";
import { SelectOption } from "../model/Error_question";
import { AddSysMenuDto } from "../model/menu";

const { Title } = Typography;
const { useForm } = Form;

interface AddMenuForm {
  parentId: number;
  menuKey: string;
  label: string;
}

export default function MenuManage({flagUpdate}:{flagUpdate:()=>void}) {
    const [firstOption, setFirstOption] = useState<SelectOption[]>([])
    const [selectedFirstId, setSelectedFirstId] = useState<number | undefined>()
    const [childMenuMap, setChildMenuMap] = useState<Record<number, SelectOption[]>>({})
    const [modalOpen, setModalOpen] = useState(false)
    const [form] = useForm<AddMenuForm>()

    useEffect(() => {
        const loadFirstMenu = async () => {
            const data = await GetFirstLevelMenuOption()
            console.log(data);
            
            setFirstOption(data)
        }
        loadFirstMenu()
    }, [])

    const handleFirstChange = async (value: number) => {
        setSelectedFirstId(value)
        if (!childMenuMap[value]) {
            const childData = await GetSecondLevelMenuOption(value)
            setChildMenuMap(prev => ({ ...prev, [value]: childData }))
        }
    }

    const openAddModal = () => {
        form.resetFields()
        form.setFieldsValue({ parentId: selectedFirstId })
        setModalOpen(true)
    }

    const submitAdd = async () => {
        const values = await form.validateFields()
        try {
            // 直接拼接路由
            const fullMenuKey = `/${selectedFirstId}/${values.menuKey}`
            const dto: AddSysMenuDto = {
                ParentID: values.parentId,
                MenuKey: fullMenuKey,
                Label: values.label,
                Type:"menu"
            }
            await AddSysMenu(dto)
            message.success("新增成功")
            flagUpdate()
            setModalOpen(false)
            const newChild = await GetSecondLevelMenuOption(values.parentId)
            setChildMenuMap(prev => ({ ...prev, [values.parentId]: newChild }))
        } catch (err) {
            console.error(err)
            message.error("新增失败")
        }
    }

    const handleDeleteChildMenu = (menuId: number, parentId: number) => {
        Modal.confirm({
            title: "确认删除",
            content: "确定删除该二级菜单？删除后无法恢复！",
            okText: "确认",
            cancelText: "取消",
            okType: "danger",
            async onOk() {
                try {
                    await DeleteMenuById(menuId)
                    message.success("菜单删除成功")
                    const newChildren = await GetSecondLevelMenuOption(parentId)
                    setChildMenuMap(prev => ({ ...prev, [parentId]: newChildren }))
                } catch (err) {
                    console.error(err)
                    message.error("删除失败")
                }
            }
        })
    }

    const collapseItems = firstOption.map(item => {
        const children = childMenuMap[item.value] ?? []
        const canOpen = children.length > 0
        const panelItem: any = {
            key: item.value,
            label: item.label,
            children: (
                <Space direction="vertical" style={{ width: "100%" }}>
                    {children.map(child => (
                        <div key={child.value} style={{
                            display:'flex',
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            background: "#f7f8fa",
                            borderRadius: 6
                        }}>
                            <span>{child.label}</span>
                            <Button
                                danger
                                size="small"
                                onClick={() => handleDeleteChildMenu(child.value, item.value)}
                            >
                                删除
                            </Button>
                        </div>
                    ))}
                </Space>
            )
        }
        if (!canOpen) {
            panelItem.collapsible = "disabled"
        }
        return panelItem
    })

    return (
        <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
            <Title level={3}>菜单管理</Title>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <Card title="选择一级菜单，新增子菜单" bordered>
                    <Space size={16}>
                        <Select
                            placeholder="请选择一级分类"
                            value={selectedFirstId}
                            onChange={handleFirstChange}
                            options={firstOption}
                            style={{ width: 260 }}
                        />
                        <Button
                            type="primary"
                            disabled={!selectedFirstId}
                            onClick={openAddModal}
                        >
                            新增二级子菜单
                        </Button>
                    </Space>
                </Card>
                <Card title="全部一级菜单及子菜单" bordered>
                    <Collapse items={collapseItems} />
                </Card>
            </Space>

            <Modal
                title="新增二级菜单"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={submitAdd}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="parentId" label="父级菜单" rules={[{ required: true }]}>
                        <Select options={firstOption} disabled />
                    </Form.Item>
                    <Form.Item name="menuKey" label="路由后缀（不要加斜杠）" rules={[{ required: true }]}>
                        <Input placeholder="例：add-error" />
                    </Form.Item>
                    <Form.Item name="label" label="菜单名称" rules={[{ required: true }]}>
                        <Input placeholder="例：新增错题" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}