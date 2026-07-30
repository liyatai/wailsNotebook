import { Card, Typography, Space, Divider } from 'antd';
const { Title, Paragraph } = Typography;

export default function Analysis() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 40px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'
    }}>
      <Card
        bordered={false}
        style={{
          width: '100%',
          maxWidth: 720,
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(26, 34, 64, 0.08)'
        }}
      >
        <Space direction="vertical" size="large" style={{ textAlign: 'center', width: '100%' }}>
          <Title level={1} style={{ margin: 0, color: '#162938' }}>
            泰棋怪电子错题本
          </Title>
          <Paragraph style={{ fontSize: 18, color: '#595959' }}>
            本地桌面错题管理工具 · Wails React 自研应用
          </Paragraph>
          <Divider style={{ margin: '12px 0' }} />
          <Space size={32} wrap style={{ justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>图片错题存储</Title>
              <Paragraph style={{ color: '#666' }}>题目、答案图片本地持久化</Paragraph>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>多级菜单分类</Title>
              <Paragraph style={{ color: '#666' }}>自定义科目、题型标签管理</Paragraph>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>纯本地离线运行</Title>
              <Paragraph style={{ color: '#666' }}>SQLite数据库，无需联网</Paragraph>
            </div>
          </Space>
          <Paragraph style={{ marginTop: 16, color: '#8c8c8c' }}>
            支持拖拽/粘贴上传截图 · 自由整理刷题错题，高效复盘
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}