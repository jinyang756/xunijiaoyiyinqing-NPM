# 🛡️ 数据脱敏功能使用指南

`jcf-sim-engine` 现在提供了内置的数据脱敏功能，可以保护用户隐私和敏感信息。本指南将介绍如何使用这些功能。

## 📦 安装和导入

数据脱敏工具已包含在 `jcf-sim-engine` 包中，无需额外安装。

```typescript
import { 
  maskUserId, 
  maskUsername, 
  maskBalance, 
  maskAmount, 
  maskContractId,
  maskTrades,
  maskAccount,
  maskContract,
  maskContracts,
  maskIndex,
  enableDataMasking,
  isDataMaskingEnabled
} from 'jcf-sim-engine'
```

## 🔧 脱敏函数详解

### 1. 用户信息脱敏

```typescript
// 脱敏用户ID
const userId = 'user_123456'
const maskedUserId = maskUserId(userId)
console.log(maskedUserId) // 输出: us****56

// 脱敏用户名
const username = '张三丰'
const maskedUsername = maskUsername(username)
console.log(maskedUsername) // 输出: 张**丰
```

### 2. 金额信息脱敏

```typescript
// 脱敏账户余额
const balance = 123456.78
const maskedBalance = maskBalance(balance)
console.log(maskedBalance) // 输出: 12****.**

// 脱敏交易金额
const amount = 9876.54
const maskedAmount = maskAmount(amount)
console.log(maskedAmount) // 输出: 9***.**
```

### 3. 合约信息脱敏

```typescript
// 脱敏合约ID
const contractId = 'contract_abcdef123456'
const maskedContractId = maskContractId(contractId)
console.log(maskedContractId) // 输出: con***456

// 脱敏单个合约
const contract = {
  contract_id: 'contract_abcdef123456',
  cost: 1000,
  profit: 150,
  strike_price: 3500.50
}
const maskedContract = maskContract(contract)
console.log(maskedContract)
// 输出: { contract_id: 'con***456', cost: '1***.**', profit: '1**.**', strike_price: '3***.**' }
```

### 4. 批量数据脱敏

```typescript
// 脱敏交易记录数组
const trades = [
  { trade_id: 'trade_001', amount: 1000, price: 3500.50, profit: 150 },
  { trade_id: 'trade_002', amount: 2000, price: 3600.75, profit: -50 }
]
const maskedTrades = maskTrades(trades)
console.log(maskedTrades)

// 脱敏账户信息
const account = {
  user_id: 'user_123456',
  username: '张三丰',
  balance: 123456.78,
  equity: 125000.00,
  trades: trades
}
const maskedAccount = maskAccount(account)
console.log(maskedAccount)
```

## 🎚️ 全局脱敏控制

### 启用/禁用脱敏模式

```typescript
// 启用数据脱敏
enableDataMasking(true)

// 检查是否启用了脱敏
if (isDataMaskingEnabled()) {
  console.log('数据脱敏已启用')
}

// 禁用数据脱敏
enableDataMasking(false)
```

## 🖥️ 在React组件中使用

```tsx
import React, { useState, useEffect } from 'react'
import { useAccountStore, useSimulationStore } from 'jcf-sim-engine'
import { maskAccount, maskContracts, maskIndex, isDataMaskingEnabled } from 'jcf-sim-engine'

function AccountPanel() {
  const account = useAccountStore(state => state.activeAccount)
  const contracts = useSimulationStore(state => state.contracts)
  const shanghaiIndex = useSimulationStore(state => state.shanghaiIndex)
  
  const [maskedAccount, setMaskedAccount] = useState(null)
  const [maskedContracts, setMaskedContracts] = useState([])
  const [maskedIndex, setMaskedIndex] = useState(null)
  
  useEffect(() => {
    if (isDataMaskingEnabled()) {
      setMaskedAccount(maskAccount(account))
      setMaskedContracts(maskContracts(contracts))
      setMaskedIndex(maskIndex(shanghaiIndex))
    } else {
      setMaskedAccount(account)
      setMaskedContracts(contracts)
      setMaskedIndex(shanghaiIndex)
    }
  }, [account, contracts, shanghaiIndex])
  
  return (
    <div>
      <h2>账户信息</h2>
      {maskedAccount && (
        <div>
          <p>用户ID: {maskedAccount.user_id}</p>
          <p>用户名: {maskedAccount.username}</p>
          <p>账户余额: {maskedAccount.balance}</p>
        </div>
      )}
      
      <h2>合约信息</h2>
      {maskedContracts.map(contract => (
        <div key={contract.contract_id}>
          <p>合约ID: {contract.contract_id}</p>
          <p>成本: {contract.cost}</p>
          <p>盈利: {contract.profit}</p>
        </div>
      ))}
    </div>
  )
}
```

## ⚙️ 高级用法

### 自定义脱敏规则

您可以通过修改环境变量或配置来控制脱敏级别：

```typescript
// 在应用初始化时设置脱敏级别
import { enableDataMasking } from 'jcf-sim-engine'

// 根据环境变量决定是否启用脱敏
const shouldMaskData = process.env.NODE_ENV === 'production' || 
                      process.env.REACT_APP_DATA_MASKING === 'true'

enableDataMasking(shouldMaskData)
```

### 条件性脱敏

```typescript
import { maskAccount, isDataMaskingEnabled } from 'jcf-sim-engine'

function getDisplayAccount(account, userType) {
  // 对于普通用户，始终脱敏
  if (userType === 'regular') {
    return maskAccount(account)
  }
  
  // 对于管理员，在特定情况下脱敏
  if (userType === 'admin' && isDataMaskingEnabled()) {
    return maskAccount(account)
  }
  
  // 其他情况返回原始数据
  return account
}
```

## 🧪 测试脱敏功能

```typescript
import { maskUserId, maskUsername, maskBalance } from 'jcf-sim-engine'

describe('数据脱敏功能测试', () => {
  test('用户ID脱敏', () => {
    expect(maskUserId('user_123456')).toBe('us****56')
  })
  
  test('用户名脱敏', () => {
    expect(maskUsername('张三丰')).toBe('张**丰')
  })
  
  test('账户余额脱敏', () => {
    expect(maskBalance(123456.78)).toBe('12****.**')
  })
})
```

## 📋 注意事项

1. **性能考虑**：脱敏操作会增加少量计算开销，但在大多数情况下可以忽略不计
2. **数据完整性**：脱敏后的数据仅用于显示，不应用于计算或业务逻辑
3. **安全性**：脱敏功能提供的是视觉层面的保护，对于高安全性要求的场景，还需要配合其他安全措施
4. **自定义需求**：如果默认的脱敏规则不满足需求，可以基于提供的函数创建自定义脱敏逻辑

通过使用这些数据脱敏功能，您可以更好地保护用户隐私，同时保持应用程序的功能完整性。