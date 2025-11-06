import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface DemoAccount {
  user_id: string
  username: string
  balance: number
  equity: number
  positions: Array<Record<string, unknown>>
  trades: Array<Record<string, unknown>>
  pnl: number
}

interface DemoAccountState {
  accounts: DemoAccount[]
  activeAccount: DemoAccount | null
  
  initDemoAccount: () => void
  getAccount: (user_id: string) => DemoAccount | undefined
  updateAccount: (user_id: string, updates: Partial<DemoAccount>) => void
  addTrade: (user_id: string, trade: Record<string, unknown>) => void
  getUserBalance: (user_id: string) => number
}

export const useAccountStore = create<DemoAccountState>()(
  immer((set, get) => ({
  accounts: [],
  activeAccount: null,

  initDemoAccount: () => {
    const demoAccount: DemoAccount = {
      user_id: 'demo_001',
      username: '演示用户',
      balance: 100000, // 10万起始资金
      equity: 100000,
      positions: [],
      trades: [],
      pnl: 0
    }

    set((state) => {
      state.accounts.push(demoAccount)
      state.activeAccount = demoAccount
    })

    // 暴露到全局，便于引擎访问
    ;(window as any).demoAccountStore = get()
  },

  getAccount: (user_id: string) => {
    return get().accounts.find(account => account.user_id === user_id)
  },

  updateAccount: (user_id: string, updates: Partial<DemoAccount>) => {
    set((state) => {
      const accountIndex = state.accounts.findIndex(account => account.user_id === user_id)
      if (accountIndex !== -1) {
        Object.assign(state.accounts[accountIndex], updates)
      }
    })
  },

  addTrade: (user_id: string, trade: Record<string, unknown>) => {
    set((state) => {
      const accountIndex = state.accounts.findIndex(account => account.user_id === user_id)
      if (accountIndex !== -1) {
        state.accounts[accountIndex].trades.push(trade)
      }
    })
  },

  getUserBalance: (user_id: string) => {
    const account = get().getAccount(user_id)
    return account ? account.balance : 0
  }
  }))
)

// 状态选择器
export const useActiveAccount = () => useAccountStore(state => state.activeAccount)
export const useAccounts = () => useAccountStore(state => state.accounts)
export const useUserBalance = (user_id: string) => useAccountStore(state => state.getUserBalance(user_id))

// 暴露到全局
if (typeof window !== 'undefined') {
  (window as any).initDemoAccount = () => {
    const { initDemoAccount } = useAccountStore.getState()
    initDemoAccount()
  }
}