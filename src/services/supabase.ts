import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

const getSupabaseConfig = () => {
  const SUPABASE_URL = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || ''
  const SUPABASE_KEY = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || ''
  
  return { SUPABASE_URL, SUPABASE_KEY }
}

const validateSupabaseConfig = (url: string, key: string): boolean => {
  if (!url || url === '') {
    console.warn('⚠️  Supabase URL 未配置，请设置 VITE_SUPABASE_URL 环境变量')
    return false
  }
  
  if (!key || key === '') {
    console.warn('⚠️  Supabase Key 未配置，请设置 VITE_SUPABASE_ANON_KEY 环境变量')
    return false
  }
  
  // 验证URL格式
  try {
    new URL(url)
  } catch (e) {
    console.warn('⚠️  Supabase URL 格式不正确')
    return false
  }
  
  return true
}

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClient) {
    return supabaseClient
  }
  
  const { SUPABASE_URL, SUPABASE_KEY } = getSupabaseConfig()
  
  if (!validateSupabaseConfig(SUPABASE_URL, SUPABASE_KEY)) {
    return null
  }
  
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      db: {
        schema: 'public'
      }
    })
    return supabaseClient
  } catch (error) {
    console.error('❌ Supabase 客户端初始化失败:', error)
    return null
  }
}

export const supabase = getSupabaseClient()

export const initSupabase = async () => {
  const client = getSupabaseClient()
  if (!client) {
    console.error('❌ Supabase 客户端未正确配置，无法初始化')
    return false
  }
  
  // 测试连接
  try {
    const { data, error } = await client.from('fund_contracts').select('count').limit(1)
    if (error) {
      console.warn('⚠️  Supabase 连接测试失败:', error.message)
    } else {
      console.log('✅ Supabase 连接测试成功')
    }
  } catch (error) {
    console.warn('⚠️  Supabase 连接测试异常:', error)
  }
  
  // 创建必要的数据表
  await createTables()
  
  console.log('✅ Supabase initialized')
  return true
}

const createTables = async () => {
  const client = getSupabaseClient()
  if (!client) return
  
  // 基金合约表
  try {
    await client.rpc('create_fund_contracts_table')
  } catch (error) {
    console.log('Fund contracts table may already exist')
  }
  
  // 交易记录表
  try {
    await client.rpc('create_trades_table')
  } catch (error) {
    console.log('Trades table may already exist')
  }
  
  // 用户账户表
  try {
    await client.rpc('create_accounts_table')
  } catch (error) {
    console.log('Accounts table may already exist')
  }
}