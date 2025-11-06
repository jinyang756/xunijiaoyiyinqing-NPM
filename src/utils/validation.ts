/**
 * 输入验证工具模块
 * 提供各种输入验证功能，确保数据安全性和完整性
 */

/**
 * 验证用户ID格式
 * @param userId 用户ID
 * @returns 是否有效
 */
export const isValidUserId = (userId: string): boolean => {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  
  // 用户ID应该是非空字符串，长度在1-50之间
  return userId.length > 0 && userId.length <= 50;
};

/**
 * 验证合约ID格式
 * @param contractId 合约ID
 * @returns 是否有效
 */
export const isValidContractId = (contractId: string): boolean => {
  if (!contractId || typeof contractId !== 'string') {
    return false;
  }
  
  // 合约ID应该是非空字符串，长度在1-100之间
  return contractId.length > 0 && contractId.length <= 100;
};

/**
 * 验证交易结果
 * @param result 交易结果
 * @returns 是否有效
 */
export const isValidContractResult = (result: string): boolean => {
  return result === 'win' || result === 'loss';
};

/**
 * 验证金额
 * @param amount 金额
 * @returns 是否有效
 */
export const isValidAmount = (amount: number): boolean => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return false;
  }
  
  // 金额应该是非负数，且不超过1000万
  return amount >= 0 && amount <= 10000000;
};

/**
 * 验证用户名
 * @param username 用户名
 * @returns 是否有效
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // 用户名应该是非空字符串，长度在1-30之间
  return username.length > 0 && username.length <= 30;
};

/**
 * 清理字符串输入，防止XSS攻击
 * @param input 输入字符串
 * @returns 清理后的字符串
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // 移除潜在的危险字符
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * 验证并清理交易数据
 * @param trade 交易数据
 * @returns 清理后的交易数据
 */
export const validateAndSanitizeTrade = (trade: Record<string, unknown>): Record<string, unknown> | null => {
  if (!trade || typeof trade !== 'object') {
    return null;
  }
  
  const sanitizedTrade: Record<string, unknown> = {};
  
  // 验证和清理各个字段
  for (const [key, value] of Object.entries(trade)) {
    if (typeof value === 'string') {
      sanitizedTrade[key] = sanitizeString(value);
    } else if (typeof value === 'number') {
      // 确保数值在合理范围内
      if (!isNaN(value) && isFinite(value)) {
        sanitizedTrade[key] = value;
      }
    } else if (typeof value === 'boolean') {
      sanitizedTrade[key] = value;
    } else if (value === null || value === undefined) {
      sanitizedTrade[key] = value;
    }
    // 其他类型的数据会被忽略
  }
  
  return sanitizedTrade;
};

/**
 * 验证账户更新数据
 * @param updates 账户更新数据
 * @returns 验证结果和清理后的数据
 */
export const validateAccountUpdates = (updates: Partial<Record<string, unknown>>): Partial<Record<string, unknown>> | null => {
  if (!updates || typeof updates !== 'object') {
    return null;
  }
  
  const validatedUpdates: Partial<Record<string, unknown>> = {};
  
  // 验证各个字段
  for (const [key, value] of Object.entries(updates)) {
    switch (key) {
      case 'username':
        if (typeof value === 'string' && isValidUsername(value)) {
          validatedUpdates[key] = sanitizeString(value);
        }
        break;
      case 'balance':
      case 'equity':
      case 'pnl':
        if (typeof value === 'number' && isValidAmount(value)) {
          validatedUpdates[key] = value;
        }
        break;
      case 'positions':
      case 'trades':
        // 数组类型需要特殊处理
        if (Array.isArray(value)) {
          validatedUpdates[key] = value;
        }
        break;
      default:
        // 其他字段会被忽略
        break;
    }
  }
  
  return Object.keys(validatedUpdates).length > 0 ? validatedUpdates : null;
};

export default {
  isValidUserId,
  isValidContractId,
  isValidContractResult,
  isValidAmount,
  isValidUsername,
  sanitizeString,
  validateAndSanitizeTrade,
  validateAccountUpdates
};