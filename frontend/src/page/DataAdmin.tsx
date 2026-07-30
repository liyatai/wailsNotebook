import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select, Button, message } from "antd";
import ImageFilePicker from "../component/ImageFilePicker";
import { GetFirstLevelMenuOption, GetSecondLevelMenuOption, AddErrorQuestion } from "../../wailsjs/go/main/App";
import { SelectOption, AddErrorQuestionReq } from "../model/Error_question";

const { Title } = Typography;

export default function DataAdmin() {
    // 题目图片base64
    const [questionBase64, setQuestionBase64] = useState<string>('')
    // 答案图片base64
    const [answerBase64, setAnswerBase64] = useState<string>('')

    // 下拉选项
    const [firstOption, setFisrtOption] = useState<SelectOption[]>([])
    const [secOption, setSecOption] = useState<SelectOption[]>([])

    // 选中菜单ID number类型，和后端uint对齐
    const [selectedFirstId, setSelectedFirstId] = useState<number | undefined>()
    const [selectedSecondId, setSelectedSecondId] = useState<number | undefined>()

    // 页面加载获取一级菜单
    useEffect(() => {
        const loadFirstMenu = async () => {
            const data = await GetFirstLevelMenuOption()
            setFisrtOption(data)
        }
        loadFirstMenu()
    }, [])

    // 切换一级菜单，加载二级菜单
    const handleFirstChange = async (value: number) => {
        setSelectedFirstId(value)
        // 切换一级，清空二级选择
        setSelectedSecondId(undefined)
        const childData = await GetSecondLevelMenuOption(value)
        setSecOption(childData)
    }

    // 清空所有表单缓存
    const clearForm = () => {
        setQuestionBase64('')
        setAnswerBase64('')
        setSelectedSecondId(undefined)
        message.info("表单已清空");
    }

    // 提交按钮事件
    const handleSubmit = async () => {
        // 简单校验
        if (!selectedFirstId) {
            message.warning("请选择一级分类");
            return;
        }
        if (!selectedSecondId) {
            message.warning("请选择二级分类");
            return;
        }
        if (!questionBase64) {
            message.warning("请上传题目图片");
            return;
        }

        // 组装请求结构体
        const submitData: AddErrorQuestionReq = {
            menuId: selectedSecondId,
            questionImg: "",
            answerImg: "",
            questBase: questionBase64,
            answerBase: answerBase64,
            masterLevel: 1,
            remark: ""
        };

        console.log("【待提交错题数据】", submitData);

        try {
            // 调用wails后端方法新增错题
            await AddErrorQuestion(submitData);
            message.success("错题新增成功！");
            // 提交成功自动清空表单
            clearForm();
        } catch (err) {
            console.error("新增错题失败：", err);
            message.error("新增错题失败：" + err);
        }
    }

    return (
        <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
            <Title level={3}>新增错题录入</Title>

            <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* 分类选择区域 */}
                <Card title="题目分类" bordered>
                    <Space size={16}>
                        <Select
                            placeholder="请选择一级分类"
                            value={selectedFirstId}
                            onChange={handleFirstChange}
                            options={firstOption}
                            style={{ width: 260 }}
                        />
                        <Select
                            placeholder="请选择二级分类"
                            value={selectedSecondId}
                            onChange={(val) => setSelectedSecondId(val)}
                            options={secOption}
                            style={{ width: 260 }}
                            disabled={!selectedFirstId}
                        />
                    </Space>
                </Card>

                {/* 题目图片区域 */}
                <Card title="题目图片" bordered>
                    <ImageFilePicker
                        value={questionBase64}
                        onChange={(base64) => {
                            setQuestionBase64(base64);
                        }}
                    />
                    {questionBase64 && (
                        <div style={{ marginTop: 16 }}>
                            <img
                                src={questionBase64}
                                alt="题目预览"
                                style={{
                                    maxHeight: 320,
                                    maxWidth: "100%",
                                    borderRadius: 6,
                                    border: "1px solid #e8e8e8"
                                }}
                            />
                        </div>
                    )}
                </Card>

                {/* 答案图片区域 */}
                <Card title="答案图片" bordered>
                    <ImageFilePicker
                        value={answerBase64}
                        onChange={(base64) => {
                            setAnswerBase64(base64);
                        }}
                    />
                    {answerBase64 && (
                        <div style={{ marginTop: 16 }}>
                            <img
                                src={answerBase64}
                                alt="答案预览"
                                style={{
                                    maxHeight: 320,
                                    maxWidth: "100%",
                                    borderRadius: 6,
                                    border: "1px solid #e8e8e8"
                                }}
                            />
                        </div>
                    )}
                </Card>

                {/* 操作按钮区域 */}
                <div style={{ textAlign: "right" }}>
                    <Space size={12}>
                        <Button onClick={clearForm}>清空表单</Button>
                        <Button type="primary" size="large" onClick={handleSubmit}>
                            提交错题
                        </Button>
                    </Space>
                </div>
            </Space>
        </div>
    )
}