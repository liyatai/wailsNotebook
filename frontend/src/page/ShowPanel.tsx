import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { GetErrorQuestionByMenuId } from "../../wailsjs/go/main/App";
import { Button, Card, Space, Divider, Statistic, Row, Col, Empty, Image, Typography } from "antd";
const { Text } = Typography;
import { ErrorQuestion } from '../model/Error_question'

export default function ShowPanel() {
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  // 错题列表
  const [list, setList] = useState<ErrorQuestion[]>([]);
  // 当前页码
  const [page, setPage] = useState(1);
  // 每页条数
  const pageSize = 1;
  // 是否显示答案
  const [showAnswer, setShowAnswer] = useState(true);
  // 已阅读题目id集合
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  // 加载错题数据
  const loadData = useCallback(async () => {
    if (!menuId) return;
    const data = await GetErrorQuestionByMenuId(Number(menuId));
    console.log(data);
    // Fisher-Yates 随机打乱数组
    const shuffleArr = [...data];
    for (let i = shuffleArr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffleArr[i], shuffleArr[randomIndex]] = [shuffleArr[randomIndex], shuffleArr[i]];
    }
    setList(shuffleArr);
    // 刷新题目重置页码
    setPage(1);
    setReadIds(new Set());
  }, [menuId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 分页计算
  const total = list.length;
  const pageTotal = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentItem = list[startIndex];

  // 标记已阅读
  const markRead = (id: number) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // 切换页码时自动标记阅读
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pageTotal) return;
    setPage(newPage);
    const targetItem = list[(newPage - 1) * pageSize];
    if (targetItem) markRead(targetItem.ID);
  };

  // 上一题
  const prev = () => changePage(page - 1);
  // 下一题
  const next = () => changePage(page + 1);

  // 阅读进度
  const readCount = readIds.size;

  if (!currentItem) {
    return <Empty description="暂无错题数据" style={{ marginTop: 120 }} />;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {/* 进度信息行 */}
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col>
          <Statistic title="总题数" value={total} suffix="道" />
        </Col>
        <Col>
          <Statistic title="已阅读" value={readCount} suffix="道" />
        </Col>
        <Col>
          <Statistic title="当前题号" value={page} suffix={`/${pageTotal}`} />
        </Col>
        <Col>
          <Statistic title="错题ID" value={currentItem.ID} />
        </Col>
      </Row>

      {/* 功能按钮 */}
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "隐藏答案" : "显示答案"}
        </Button>
        {/* 可选：增加【重新打乱顺序】按钮 */}
        <Button onClick={() => loadData()}>重新随机打乱</Button>
      </Space>

      {/* 题目卡片 */}
      <Card title="题目" bordered style={{ marginBottom: 16 }}>
        {currentItem.QuestionImg ? (
          <Image
            src={`/${currentItem.QuestionImg}`}
            alt="题目图片"
            style={{ maxWidth: "100%", maxHeight: 650 }}
            fallback="https://via.placeholder.com/600?text=图片加载失败"
          />
        ) : (
          <Text type="secondary">无题目图片</Text>
        )}
      </Card>

      {/* 答案卡片 */}
      {showAnswer && (
        <Card title="参考答案" bordered style={{ marginBottom: 24 }}>
          {currentItem.AnswerImg ? (
            <Image
              src={`/${currentItem.AnswerImg}`}
              alt="答案图片"
              style={{ maxWidth: "100%", maxHeight: 650 }}
              fallback="https://via.placeholder.com/600?text=图片加载失败"
            />
          ) : (
            <Text type="secondary">无答案图片</Text>
          )}
        </Card>
      )}

      <Divider />

      {/* 分页控制 */}
      <Space size="large">
        <Button onClick={prev} disabled={page <= 1}>
          上一题
        </Button>
        <Button type="primary" onClick={next} disabled={page >= pageTotal}>
          下一题
        </Button>
      </Space>
    </div>
  );
}