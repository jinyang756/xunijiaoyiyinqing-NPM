import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Button, Tabs, Table, notification } from 'antd'
import { Line, Column } from '@ant-design/plots'
import { DownloadOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { 
  useSimulationStore, 
  useAccountStore, 
  exportFundContracts, 
  exportTrades,
  requestNotificationPermission
} from '../src/index'

const { TabPane } = Tabs

export const SimulationDashboard: React.FC = () => {
  const { 
    contracts, 
    shanghaiIndex, 
    hongkongIndex,
    fundNavs 
  } = useSimulationStore()
  
  const { activeAccount } = useAccountStore()
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    // 请求通知权限
    requestNotificationPermission()
    
    // 监听通知事件
    const handleNotification = (event: CustomEvent) => {
      notification.open({
        message: event.detail.title,
        description: event.detail.message,
        type: event.detail.type,
        placement: 'topRight'
      })
    }
    
    window.addEventListener('simulation-notification', handleNotification as EventListener)
    return () => window.removeEventListener('simulation-notification', handleNotification as EventListener)
  }, [])

  // 基金合约数据处理
  const contractChartData = contracts.slice(-50).map(contract => ({
    time: new Date(contract.issue_time).toLocaleTimeString(),
    type: contract.type === 'shanghai' ? '上证' : '恒生',
    profit: contract.profit || 0,
    status: contract.status
  }))

  // 净值数据处理
  const navChartData = fundNavs.slice(-30).map(nav => ({
    date: nav.nav_date,
    value: nav.value,
    fund: nav.fund_code
  }))

  // 北向南向资金流数据
  const capitalFlowData = [
    { time: new Date(shanghaiIndex.last_updated).toLocaleTimeString(), type: '北向资金', flow: shanghaiIndex.northbound_flow },
    { time: new Date(hongkongIndex.last_updated).toLocaleTimeString(), type: '南向资金', flow: hongkongIndex.southbound_flow }
  ]

  const contractColumns = [
    { title: '类型', dataIndex: 'type', render: (t: string) => t === 'shanghai' ? '上证' : '恒生' },
    { title: '方向', dataIndex: 'direction', render: (d: string) => d === 'call' ? '看涨' : '看跌' },
    { title: '投入', dataIndex: 'cost', render: (c: number) => `¥${c}` },
    { title: '盈利', dataIndex: 'profit', render: (p: number) => p ? `¥${p}` : '-' },
    { title: '状态', dataIndex: 'status', render: (s: string) => s === 'won' ? '盈利' : s === 'lost' ? '亏损' : '开放中' },
    { title: '到期时间', dataIndex: 'expiration_time', render: (t: string) => new Date(t).toLocaleTimeString() }
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题和控制按钮 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            聚财众发 · 虚拟交易平台
          </h1>
          <div className="flex space-x-4">
            <Button 
              type="primary" 
              icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? '暂停' : '开始'}
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => {
                exportFundContracts()
                exportTrades()
              }}
            >
              导出数据
            </Button>
          </div>
        </div>

        {/* 关键指标卡片 */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic 
                title="上证指数" 
                value={shanghaiIndex.current_price} 
                precision={2}
                valueStyle={{ color: shanghaiIndex.current_price > 3500 ? '#cf1322' : '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="恒生指数" 
                value={hongkongIndex.current_price} 
                precision={2}
                valueStyle={{ color: hongkongIndex.current_price > 22000 ? '#cf1322' : '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="北向资金" 
                value={shanghaiIndex.northbound_flow} 
                precision={0}
                suffix="元"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="账户余额" 
                value={activeAccount?.balance || 0} 
                precision={2}
                suffix="元"
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={16} className="mb-6">
          <Col span={12}>
            <Card title="基金合约盈亏趋势" className="h-96">
              <Line
                data={contractChartData}
                xField="time"
                yField="profit"
                seriesField="type"
                smooth
                animation={{
                  appear: {
                    animation: 'path-in',
                    duration: 1000,
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="私募基金净值" className="h-96">
              <Line
                data={navChartData}
                xField="date"
                yField="value"
                seriesField="fund"
                smooth
                animation={{
                  appear: {
                    animation: 'path-in',
                    duration: 1000,
                  },
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* 资金流图表 */}
        <Row gutter={16} className="mb-6">
          <Col span={12}>
            <Card title="北向南向资金流" className="h-80">
              <Column
                data={capitalFlowData}
                xField="type"
                yField="flow"
                colorField="type"
                color={['#1890ff', '#f5222d']}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="实时合约" className="h-80">
              <Table
                rowKey="contract_id"
                dataSource={contracts.slice(-10)}
                columns={contractColumns}
                size="small"
                pagination={false}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}