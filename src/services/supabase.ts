import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_KEY = typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

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