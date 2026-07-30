import { useState, useEffect, useMemo } from 'react'
import { GetAllValidErrorQuestion, DeleteErrorQuestionById } from '../../wailsjs/go/main/App'
import { ErrorQuestion } from '../model/Error_question'
import { Table, Button, Image, Space, message, Modal } from 'antd'

const PAGE_SIZE = 10

export default function Delete() {
  const [fullList, setFullList] = useState<ErrorQuestion[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const tableData = useMemo(() => {
    // 先复制数组，按ID升序排序 a.ID - b.ID
    const sortedList = [...fullList].sort((a, b) => a.ID - b.ID)
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return sortedList.slice(start, end)
  }, [fullList, currentPage])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await GetAllValidErrorQuestion()
      console.log(res);
      setFullList(res)
    } catch (err) {
      console.error('加载错题失败', err)
    } finally {
      setLoading(false)
    }
  }

  // 删除处理函数，增加确认弹窗
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这条错题吗？图片文件将会一并清除，删除后无法恢复！',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      async onOk() {
        try {
          await DeleteErrorQuestionById(id)
          message.success('删除成功')
          loadData()
        } catch (err) {
          console.error('删除失败', err)
          message.error('删除失败')
        }
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: 80
    },
    {
      title: '分类MenuID',
      dataIndex: 'MenuID',
      key: 'MenuID',
      width: 120
    },
    {
      title: '题目图片',
      dataIndex: 'QuestionImg',
      key: 'QuestionImg',
      width: 220,
      render: (url: string) => {
        if (!url) return '无图片'
        return <Image key={url} width={120} src={`/${url}`} preview />
      }
    },
    {
      title: '解析图片',
      dataIndex: 'AnswerImg',
      key: 'AnswerImg',
      width: 220,
      render: (url: string) => {
        if (!url) return '无图片'
        return <Image key={url} width={120} src={`/${url}`} preview />
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: ErrorQuestion) => (
        <Space>
          <Button danger size="small" onClick={() => handleDelete(record.ID)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 16 }}>
      <h2>错题管理</h2>
      <Table
        rowKey="ID"
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: fullList.length,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page)
        }}
      />
    </div>
  )
}