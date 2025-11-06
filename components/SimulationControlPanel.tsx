import React, { useState } from 'react'
import { Card, Slider, Select, Tabs, Button, InputNumber, Space, Switch } from 'antd'
import { 
  useSimulationStore, 
  useAccountStore,
  exportFundContracts,
  exportTrades,
  notify
} from '../src/index'

const { TabPane } = Tabs

export const SimulationControlPanel: React.FC = () => {
  const { 
    ipoWinRate, 
    fundVolatilities, 
    shanghaiIndex,
    hongkongIndex,
    contracts,
    setIpoWinRate, 
    setFundVolatility,
    setContractResult
  } = useSimulationStore()

  const { activeAccount } = useAccountStore()

  const [selectedContract, setSelectedContract] = useState('')
  const [contractAmount, setContractAmount] = useState(1000)
  const [autoTrade, setAutoTrade] = useState(false)

  const openContracts = contracts.filter(c => c.status === 'open')
  const todayContracts = contracts.filter(c => 
    new Date(c.issue_time).toDateString() === new Date().toDateString()
  )

  const handleCreateContract = () => {
    if (activeAccount && activeAccount.balance >= contractAmount) {
      // 这里可以调用生成合约的方法
      notify('合约创建', `已创建 ${contractAmount} 元合约`)
    } else {
      notify('余额不足', '账户余额不足')
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">控制台</h2>
        <div className="flex space-x-2">
          <Button onClick={() => exportFundContracts()} size="small">
            导出合约
          </Button>
          <Button onClick={() => exportTrades()} size="small">
            导出交易
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="contracts" type="card">
        {/* 基金合约控制 */}
        <TabPane tab="基金合约" key="contracts">
          <Space direction="vertical" size="large" className="w-full">
            {/* 合约状态概览 */}
            <Card size="small">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{openContracts.length}</div>
                  <div className="text-sm text-gray-600">开放合约</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {contracts.filter(c => c.status === 'won').length}
                  </div>
                  <div className="text-sm text-gray-600">盈利合约</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {contracts.filter(c => c.status === 'lost').length}
                  </div>
                  <div className="text-sm text-gray-600">亏损合约</div>
                </div>
              </div>
            </Card>

            {/* 指数状态 */}
            <Card size="small" title="当前指数">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-medium">上证指数</div>
                  <div className="text-xl font-bold">{shanghaiIndex.current_price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    北向: {shanghaiIndex.northbound_flow > 0 ? '+' : ''}{(shanghaiIndex.northbound_flow / 100000000).toFixed(1)}亿
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium">恒生指数</div>
                  <div className="text-xl font-bold">{hongkongIndex.current_price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    南向: {hongkongIndex.southbound_flow > 0 ? '+' : ''}{(hongkongIndex.southbound_flow / 100000000).toFixed(1)}亿
                  </div>
                </div>
              </div>
            </Card>

            {/* 快速开仓 */}
            <Card size="small" title="快速开仓">
              <div className="flex items-center space-x-4 mb-4">
                <label>开仓金额:</label>
                <InputNumber 
                  min={100} 
                  max={10000} 
                  step={100}
                  value={contractAmount}
                  onChange={value => setContractAmount(value as number)}
                />
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={autoTrade}
                    onChange={setAutoTrade}
                  />
                  <span className="text-sm">自动交易</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="primary" onClick={handleCreateContract}>
                  开仓看涨
                </Button>
                <Button danger onClick={handleCreateContract}>
                  开仓看跌
                </Button>
              </div>
            </Card>

            {/* 手动干预 */}
            <Card size="small" title="手动干预">
              <div className="flex items-center space-x-4 mb-4">
                <Select
                  style={{ width: 200 }}
                  value={selectedContract}
                  onChange={setSelectedContract}
                  placeholder="选择合约"
                  options={openContracts.map(c => ({
                    value: c.contract_id,
                    label: `${c.type === 'shanghai' ? '上证' : '恒生'} ${c.direction === 'call' ? '看涨' : '看跌'} ${c.duration}min`
                  }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="primary" 
                  onClick={() => selectedContract && setContractResult(selectedContract, 'won')}
                  disabled={!selectedContract}
                >
                  强制盈利
                </Button>
                <Button 
                  danger 
                  onClick={() => selectedContract && setContractResult(selectedContract, 'lost')}
                  disabled={!selectedContract}
                >
                  强制亏损
                </Button>
              </div>
            </Card>
          </Space>
        </TabPane>

        {/* 新股申购 */}
        <TabPane tab="新股申购" key="ipo">
          <Space direction="vertical" size="large" className="w-full">
            <Card size="small">
              <div className="mb-4">
                <label className="block mb-2">中签率调节</label>
                <Slider
                  min={0.0001}
                  max={0.01}
                  step={0.0001}
                  value={ipoWinRate}
                  onChange={setIpoWinRate}
                  tooltip={{ open: true }}
                  formatter={(v) => `${(v * 100).toFixed(4)}%`}
                />
              </div>
              <div className="text-sm text-gray-600">
                当前中签率: {(ipoWinRate * 100).toFixed(4)}%
              </div>
            </Card>
          </Space>
        </TabPane>

        {/* 基金波动率 */}
        <TabPane tab="基金波动率" key="funds">
          <Space direction="vertical" size="large" className="w-full">
            <Card size="small">
              <div className="mb-4">
                <label className="block mb-2">选择基金</label>
                <Select
                  style={{ width: '100%' }}
                  defaultValue="JCF-CTA-001"
                  options={[
                    { value: 'JCF-CTA-001', label: '量化CTA一号' },
                    { value: 'JCF-QM-002', label: '量化多因子二号' },
                    { value: 'JCF-ARBITRAGE-003', label: '统计套利三号' },
                    { value: 'JCF-ALPHA-004', label: 'AI阿尔法四号' },
                    { value: 'JCF-BOND-005', label: '固收增强五号' }
                  ]}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">波动率调节</label>
                <Slider
                  min={0.001}
                  max={0.05}
                  step={0.001}
                  defaultValue={0.015}
                  tooltip={{ open: true }}
                  formatter={(v) => `${(v * 100).toFixed(2)}%`}
                />
              </div>
            </Card>
          </Space>
        </TabPane>

        {/* 账户信息 */}
        <TabPane tab="账户信息" key="account">
          <Card size="small">
            {activeAccount ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>用户名:</span>
                  <span>{activeAccount.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>账户余额:</span>
                  <span>¥{activeAccount.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>总收益:</span>
                  <span className={activeAccount.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {activeAccount.pnl >= 0 ? '+' : ''}¥{activeAccount.pnl.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>交易次数:</span>
                  <span>{activeAccount.trades.length}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">未初始化模拟账户</div>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}