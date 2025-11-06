import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || ''
const SUPABASE_KEY = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || ''

// 安全检查：确保在生产环境中提供了必要的配置
if (typeof window !== 'undefined' && !process.env?.VITE_SUPABASE_URL) {
  console.warn('⚠️  Supabase URL 未配置，请设置 VITE_SUPABASE_URL 环境变量')
}

if (typeof window !== 'undefined' && !process.env?.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️  Supabase Key 未配置，请设置 VITE_SUPABASE_ANON_KEY 环境变量')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const initSupabase = async () => {
  // 创建必要的数据表
  await createTables()
  
  console.log('✅ Supabase initialized')
}

const createTables = async () => {
  // 基金合约表
  try {
    await supabase.rpc('create_fund_contracts_table')
  } catch (error) {
    console.log('Fund contracts table may already exist')
  }
  
  // 交易记录表
  try {
    await supabase.rpc('create_trades_table')
  } catch (error) {
    console.log('Trades table may already exist')
  }
  
  // 用户账户表
  try {
    await supabase.rpc('create_accounts_table')
  } catch (error) {
    console.log('Accounts table may already exist')
  }
}