# 📚 jcf-sim-engine 使用指南

恭喜你已经发布了 NPM 包！  
下面是**在你的 React 前端项目中集成和使用 `jcf-sim-engine` 的标准流程**，并给出常见用法和最佳实践。

---

## 1️⃣ 安装你的 NPM 包

在你的 React 项目根目录下执行：

```bash
npm install jcf-sim-engine
# 或者
yarn add jcf-sim-engine
# 或者
pnpm add jcf-sim-engine
```

---

## 2️⃣ 初始化模拟引擎

在你的项目入口（如 `App.tsx` 或 `main.tsx`）中初始化：

```tsx
import { useEffect } from 'react'
import { initSimulation } from 'jcf-sim-engine'

function App() {
  useEffect(() => {
    // 初始化模拟引擎（只需调用一次）
    initSimulation({
      speed: 60, // 1秒=1分钟
      startAt: new Date('2025-08-01T09:30:00'),
      enableFundContract: true,
      demoAccount: true,
      enableSupabase: false, // 如需持久化可设为true并配置环境变量
      enableWebSocket: true
    })
  }, [])

  return (
    <div>
      {/* 你的页面内容 */}
    </div>
  )
}

export default App
```

---

## 3️⃣ 使用内置仪表盘和控制台组件

如果你采用了包内的 UI 组件（推荐），直接引入即可：

```tsx
import { SimulationDashboard, SimulationControlPanel } from 'jcf-sim-engine/components'

function App() {
  // ...如上初始化
  return (
    <div>
      <SimulationDashboard />
      <SimulationControlPanel />
    </div>
  )
}
```

> **注意**：如需自定义样式，确保你的项目已集成 `antd`、`tailwindcss` 或相关依赖。

---

## 4️⃣ 获取和使用模拟数据

你可以在任意组件中通过 `zustand` hooks 获取实时数据：

```tsx
import { useSimulationStore, useAccountStore } from 'jcf-sim-engine'

function MyCustomPanel() {
  const contracts = useSimulationStore(state => state.contracts)
  const shanghaiIndex = useSimulationStore(state => state.shanghaiIndex)
  const account = useAccountStore(state => state.activeAccount)

  return (
    <div>
      <div>当前上证指数：{shanghaiIndex.current_price}</div>
      <div>账户余额：{account?.balance}</div>
      <div>今日合约数：{contracts.length}</div>
    </div>
  )
}
```

---

## 5️⃣ 触发模拟交易/合约

如需在前端自定义下单/开仓：

```tsx
function OpenContractButton() {
  const { createContract } = useSimulationStore.getState()
  return (
    <button
      onClick={() => createContract('shanghai', 'call', 5, 1000)}
    >
      开一笔上证5分钟看涨合约（1000元）
    </button>
  )
}
```
> 具体API以你的包导出为准，通常会有 `createContract`、`setContractResult` 等方法。

---

## 6️⃣ 导出数据

内置导出方法，直接调用即可：

```tsx
import { exportFundContracts, exportTrades } from 'jcf-sim-engine'

function ExportButtons() {
  return (
    <div>
      <button onClick={exportFundContracts}>导出合约数据</button>
      <button onClick={exportTrades}>导出交易记录</button>
    </div>
  )
}
```

---

## 7️⃣ （可选）集成 Supabase 持久化

如需持久化到 Supabase，配置 `.env` 并在初始化时开启：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
```tsx
initSimulation({
  enableSupabase: true,
  // 其他参数...
})
```

---

## 8️⃣ （可选）WebSocket 实时推送

如需推送到你的 WebSocket 服务，配置 `.env` 并在初始化时开启：

```env
VITE_WEBSOCKET_URL=wss://your-websocket-server.com
```
```tsx
initSimulation({
  enableWebSocket: true,
  // 其他参数...
})
```

---

## 9️⃣ 常见问题

- **样式不生效？**  
  请确保已引入 `antd` 和 `tailwindcss`，并在入口文件引入样式：
  ```js
  import 'antd/dist/reset.css'
  import './index.css' // Tailwind
  ```

- **找不到组件？**  
  检查你的包是否正确导出了 `SimulationDashboard`、`SimulationControlPanel` 等组件。

- **数据不刷新？**  
  确保你的组件用的是 `useSimulationStore` 或 `useAccountStore` 这样的 hooks。

---

## 10️⃣ 进阶玩法

- **自定义仪表盘**：用 `useSimulationStore` 获取数据，配合 ECharts/Recharts/Antd Table 自己画图。
- **多账户切换**：用 `useAccountStore` 管理多个模拟账户。
- **参数联动**：用控制台组件实时调节中签率、波动率、合约结果等。

---

## 11️⃣ 参考Demo

```tsx
import { initSimulation, SimulationDashboard, SimulationControlPanel } from 'jcf-sim-engine'

initSimulation({
  speed: 60,
  startAt: new Date('2025-08-01T09:30:00'),
  enableFundContract: true,
  demoAccount: true
})

export default function App() {
  return (
    <div>
      <SimulationDashboard />
      <SimulationControlPanel />
    </div>
  )
}
```

---

## 12️⃣ 你可以做的更多

- 直接用包内的仪表盘和控制台，**零代码即可上线演示**。
- 用 hooks 拿到所有模拟数据，**自定义你的前端页面**。
- 结合 Supabase/WebSocket，**实现多端同步和实时推送**。
- 通过控制台，**随时调节所有参数和结果**，适合演示、教学、产品原型。

---

如有任何问题，欢迎随时追问！  
如果需要**完整的前端 Demo 项目模板**，请回复"要 Demo 模板"，我可以直接生成一份给你。