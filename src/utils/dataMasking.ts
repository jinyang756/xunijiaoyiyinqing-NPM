/**
 * 数据脱敏工具模块
 * 提供各种数据脱敏功能，保护用户隐私和敏感信息
 */

/**
 * 脱敏用户ID
 * @param userId 原始用户ID
 * @returns 脱敏后的用户ID
 */
export const maskUserId = (userId: string): string => {
  if (!userId || userId.length <= 4) {
    return '****'
  }
  return userId.substring(0, 2) + '****' + userId.substring(userId.length - 2)
}

/**
 * 脱敏用户名
 * @param username 原始用户名
 * @returns 脱敏后的用户名
 */
export const maskUsername = (username: string): string => {
  if (!username) {
    return '***'
  }
  if (username.length === 1) {
    return '*'
  }
  if (username.length === 2) {
    return username.charAt(0) + '*'
  }
  return username.charAt(0) + '**' + username.charAt(username.length - 1)
}

/**
 * 脱敏账户余额
 * @param balance 原始余额
 * @param precision 保留小数位数
 * @returns 脱敏后的余额（只保留整数部分的前两位）
 */
export const maskBalance = (balance: number, precision: number = 2): string => {
  if (balance < 100) {
    return balance.toFixed(precision)
  }
  
  // 只显示前两位数字，其余用*代替
  const balanceStr = Math.floor(balance).toString()
  if (balanceStr.length <= 2) {
    return balance.toFixed(precision)
  }
  
  return balanceStr.substring(0, 2) + '*'.repeat(balanceStr.length - 2) + '.' + '*'.repeat(precision)
}

/**
 * 脱敏交易金额
 * @param amount 原始金额
 * @returns 脱敏后的金额
 */
export const maskAmount = (amount: number): string => {
  if (amount < 10) {
    return amount.toFixed(2)
  }
  
  const amountStr = Math.floor(amount).toString()
  if (amountStr.length <= 1) {
    return amount.toFixed(2)
  }
  
  return amountStr.charAt(0) + '*'.repeat(amountStr.length - 1) + '.' + '**'
}

/**
 * 脱敏合约ID
 * @param contractId 原始合约ID
 * @returns 脱敏后的合约ID
 */
export const maskContractId = (contractId: string): string => {
  if (!contractId || contractId.length <= 6) {
    return '******'
  }
  return contractId.substring(0, 3) + '***' + contractId.substring(contractId.length - 3)
}

/**
 * 脱敏交易记录
 * @param trades 原始交易记录数组
 * @returns 脱敏后的交易记录数组
 */
export const maskTrades = (trades: any[]): any[] => {
  return trades.map(trade => ({
    ...trade,
    trade_id: trade.trade_id ? maskContractId(trade.trade_id) : '***',
    amount: trade.amount ? maskAmount(trade.amount) : '0.00',
    price: trade.price ? maskAmount(trade.price) : '0.00',
    profit: trade.profit ? maskAmount(Math.abs(trade.profit)) : '0.00'
  }))
}

/**
 * 脱敏账户信息
 * @param account 原始账户信息
 * @returns 脱敏后的账户信息
 */
export const maskAccount = (account: any): any => {
  if (!account) return null
  
  return {
    ...account,
    user_id: maskUserId(account.user_id),
    username: maskUsername(account.username),
    balance: maskBalance(account.balance),
    equity: maskBalance(account.equity),
    trades: maskTrades(account.trades || [])
  }
}

/**
 * 脱敏合约信息
 * @param contract 原始合约信息
 * @returns 脱敏后的合约信息
 */
export const maskContract = (contract: any): any => {
  if (!contract) return null
  
  return {
    ...contract,
    contract_id: maskContractId(contract.contract_id),
    cost: maskAmount(contract.cost),
    profit: contract.profit ? maskAmount(Math.abs(contract.profit)) : '0.00',
    strike_price: maskAmount(contract.strike_price)
  }
}

/**
 * 脱敏所有合约信息
 * @param contracts 原始合约数组
 * @returns 脱敏后的合约数组
 */
export const maskContracts = (contracts: any[]): any[] => {
  return contracts.map(contract => maskContract(contract))
}

/**
 * 脱敏指数信息
 * @param index 原始指数信息
 * @returns 脱敏后的指数信息
 */
export const maskIndex = (index: any): any => {
  if (!index) return null
  
  // 对于指数信息，我们只脱敏资金流数据，保留指数本身用于显示
  return {
    ...index,
    current_price: index.current_price,
    last_updated: index.last_updated,
    northbound_flow: index.northbound_flow ? maskAmount(index.northbound_flow) : '0.00',
    southbound_flow: index.southbound_flow ? maskAmount(index.southbound_flow) : '0.00'
  }
}

/**
 * 启用数据脱敏模式
 * @param enable 是否启用脱敏
 */
export const enableDataMasking = (enable: boolean = true): void => {
  // 在全局对象上设置脱敏标志
  if (typeof window !== 'undefined') {
    (window as any).dataMaskingEnabled = enable
  }
}

/**
 * 检查是否启用了数据脱敏
 * @returns 是否启用了数据脱敏
 */
export const isDataMaskingEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!(window as any).dataMaskingEnabled
  }
  return false
}

export default {
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
}