# 聚财众发虚拟交易引擎 (jcf-sim-engine) v3.0

高仿真的全业务交易模拟平台，集成了A股新股申购、私募基金、大宗交易、机构席位和创新的基金合约交易。

## 🎯 核心特性

- **🚀 全业务引擎**: 新股申购 + 私募基金 + 大宗交易 + 机构席位 + 基金合约
- **📊 实时模拟**: 从2025-08-01开始的历史数据 + 实时模拟
- **🎮 控制台**: 可调节中签率、波动率、手动干预结果
- **💰 模拟账户**: 完整的资金管理、盈亏计算
- **📈 数据可视化**: ECharts图表 + 完整仪表盘
- **💾 数据持久化**: Supabase集成 + CSV导出
- **🔔 实时通知**: WebSocket推送 + 浏览器通知
- **⚡ 性能优化**: WebWorker + 智能调度

## 📦 安装

```bash
npm install jcf-sim-engine
```

## 🚀 快速开始

### 基础使用

```typescript
import { initSimulation } from 'jcf-sim-engine'
import { SimulationDashboard } from 'jcf-sim-engine/components'

// 初始化引擎
const scheduler = initSimulation({
  speed: 60,                    // 1秒=1分钟
  startAt: new Date('2025-08-01T09:30:00'),
  enableFundContract: true,      // 启用基金合约
  demoAccount: true,            // 启用模拟账户
  enableSupabase: false,        // 启用Supabase（需要配置）
  enableWebSocket: true         // 启用WebSocket
})

// 在React组件中使用
function App() {
  return (
    <div>
      <SimulationDashboard />
    </div>
  )
}
```

### 完整功能

```typescript
import { 
  initSimulation, 
  useSimulationStore, 
  useAccountStore,
  exportFundContracts,
  exportTrades
} from 'jcf-sim-engine'

// 带完整功能的初始化
const scheduler = initSimulation({
  speed: 60,
  startAt: new Date('2025-08-01'),
  enableFundContract: true,
  enableFutures: true,        // 期货套利
  enableETF: true,            // ETF申赎
  enableOptions: true,        // 期权策略
  enableSupabase: true,
  enableWebSocket: true,
  demoAccount: true
})

// 获取数据
const contracts = useSimulationStore(state => state.contracts)
const account = useAccountStore(state => state.activeAccount)

// 导出数据
const handleExport = () => {
  exportFundContracts()
  exportTrades()
}
```

## 🎮 业务模块详解

### 1. 基金合约交易 ⭐
- **类型**: 上海（上证指数） / 香港（恒生指数）
- **交易方式**: 看涨/看跌二元期权
- **期限**: 5分钟 / 10分钟 / 30分钟
- **倍数**: 1.95倍
- **特色**: 模拟北向/南向资金流对指数影响

### 2. 新股申购
- **数据源**: 对接东方财富数据结构
- **控制**: 中签率可调（0.01%-1%）
- **功能**: 自动抽签、手动干预

### 3. 私募基金
- **产品**: 5只量化策略基金
- **策略**: CTA、多因子、套利、AI阿尔法、固收增强
- **控制**: 波动率、收益率曲线调节

### 4. 大宗交易
- **类型**: 模拟大额撮合成交
- **特色**: 折价交易、买方为聚财众发

### 5. 机构席位
- **功能**: 模拟机构专属交易通道
- **数据**: 实时交易量、费率折扣

## 🛠️ 控制台功能

### 基金合约控制台
- 📊 **实时指数**: 上证/恒生指数 + 北向/南向资金流
- ⚡ **快速开仓**: 选择金额自动生成合约
- 🎯 **手动干预**: 强制设置合约盈亏结果
- 📈 **盈亏统计**: 实时统计开放/盈利/亏损合约

### 参数调节
- **中签率**: 0.01%-1%可调
- **基金波动率**: 0.1%-5%可调
- **交易速度**: 1秒=1分钟到1秒=1天可调
- **市场情绪**: 影响波动率参数

## 💾 数据管理

### Supabase集成
```typescript
// 配置环境变量
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

// 自动创建数据表并同步数据
```

### 数据导出
- **CSV格式**: 支持Excel打开
- **数据范围**: 所有交易记录、基金净值、合约明细
- **实时导出**: 支持导出当天数据

## 🔔 通知系统

- **浏览器通知**: 合约结算、资金变动
- **WebSocket推送**: 实时价格、交易提醒
- **声音提醒**: 可配置的音频提示

## 🎨 UI组件

### 完整仪表盘
- **实时图表**: ECharts + Ant Design
- **关键指标**: 指数、资金流、账户余额
- **交易列表**: 可排序、可筛选
- **响应式设计**: 支持移动端

### 控制台面板
- **模块化设计**: 每个业务模块独立Tab
- **参数可视化**: 滑块、开关、数值输入
- **状态显示**: 实时更新各模块状态

## 🧪 测试

运行测试套件：

```bash
npm test
```

## 📄 许可证

MIT License

## 📞 联系我们

- **公司**: 武汉聚财众发私募基金管理有限公司
- **地址**: 湖北省武汉市武汉经济技术开发区万达广场B区S5-1栋19层
- **法定代表人**: 赖泳锋

---
**由武汉聚财众发私募基金管理有限公司开发维护**