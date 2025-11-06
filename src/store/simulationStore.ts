import { create } from 'zustand'

// 模拟基金合约接口
interface SimulationFundContract {
  contract_id: string
  type: 'shanghai' | 'hongkong'
  strike_price: number
  issue_time: string
  expiration_time: string
  duration: number
  direction: 'call' | 'put'
  payout_multiplier: number
  status: 'open' | 'won' | 'lost'
  cost: number
  profit?: number
  [key: string]: any
}

// 上证指数接口
export interface StoreShanghaiIndex {
  current_price: number
  last_updated: string
  northbound_flow: number
}

// 恒生指数接口
export interface StoreHongKongIndex {
  current_price: number
  last_updated: string
  southbound_flow: number
}

// 基金净值接口
export interface FundNav {
  fund_code: string
  nav_date: string
  value: number
}

// 模拟状态接口
interface SimulationState {
  contracts: SimulationFundContract[]
  shanghaiIndex: StoreShanghaiIndex
  hongkongIndex: StoreHongKongIndex
  fundNavs: FundNav[]
  ipoWinRate: number
  fundVolatilities: Record<string, number>
  
  // 操作函数
  addContract: (contract: SimulationFundContract) => void
  updateContract: (contract: SimulationFundContract) => void
  updateShanghaiIndex: (index: StoreShanghaiIndex) => void
  updateHongkongIndex: (index: StoreHongKongIndex) => void
  addFundNav: (nav: FundNav) => void
  setIpoWinRate: (rate: number) => void
  setFundVolatility: (fundCode: string, volatility: number) => void
  setContractResult: (contractId: string, result: 'win' | 'loss') => void
}

// 创建模拟状态存储
export const useSimulationStore = create<SimulationState>()((set, get) => ({
  // 初始状态
  contracts: [],
  shanghaiIndex: {
    current_price: 3500.0,
    last_updated: new Date().toISOString(),
    northbound_flow: 5000000000
  } as StoreShanghaiIndex,
  hongkongIndex: {
    current_price: 22000.0,
    last_updated: new Date().toISOString(),
    southbound_flow: 3000000000
  } as StoreHongKongIndex,
  fundNavs: [],
  ipoWinRate: 0.005,
  fundVolatilities: {
    'JCF-CTA-001': 0.015,
    'JCF-QM-002': 0.012,
    'JCF-ARBITRAGE-003': 0.008,
    'JCF-ALPHA-004': 0.020,
    'JCF-BOND-005': 0.005
  },

  // 操作函数实现
  addContract: (contract: SimulationFundContract) => set((state) => ({
    contracts: [...state.contracts, contract]
  })),

  updateContract: (contract: SimulationFundContract) => set((state) => ({
    contracts: state.contracts.map(c => 
      c.contract_id === contract.contract_id ? contract : c
    )
  })),

  updateShanghaiIndex: (index) => set({ shanghaiIndex: index }),

  updateHongkongIndex: (index) => set({ hongkongIndex: index }),

  addFundNav: (nav) => set((state) => ({
    fundNavs: [...state.fundNavs, nav]
  })),

  setIpoWinRate: (rate) => set({ ipoWinRate: rate }),

  setFundVolatility: (fundCode, volatility) => set((state) => ({
    fundVolatilities: {
      ...state.fundVolatilities,
      [fundCode]: volatility
    }
  })),

  setContractResult: (contractId, result) => set((state) => ({
    contracts: state.contracts.map(contract => {
      if (contract.contract_id === contractId && contract.status === 'open') {
        const newStatus = result === 'win' ? 'won' : 'lost'
        const profit = result === 'win' 
          ? contract.cost * (contract.payout_multiplier - 1) 
          : -contract.cost
        
        return {
          ...contract,
          status: newStatus,
          profit
        }
      }
      return contract
    })
  }))
}))

// 状态选择器
export const useContracts = () => useSimulationStore(state => state.contracts)
export const useShanghaiIndex = () => useSimulationStore(state => state.shanghaiIndex)
export const useHongkongIndex = () => useSimulationStore(state => state.hongkongIndex)
export const useFundNavs = () => useSimulationStore(state => state.fundNavs)
export const useIpoWinRate = () => useSimulationStore(state => state.ipoWinRate)
export const useFundVolatilities = () => useSimulationStore(state => state.fundVolatilities)

// 状态选择器（带参数）
export const useContractById = (contractId: string) => useSimulationStore(state => 
  state.contracts.find(contract => contract.contract_id === contractId)
)

export const useFundNavByCode = (fundCode: string) => useSimulationStore(state => 
  state.fundNavs.find(nav => nav.fund_code === fundCode)
)

// 暴露到全局window对象（用于其他模块访问）
if (typeof window !== 'undefined') {
  (window as any).simStore = {
    addContract: (contract: SimulationFundContract) => {
      const { addContract } = useSimulationStore.getState()
      addContract(contract)
    },
    updateContract: (contract: SimulationFundContract) => {
      const { updateContract } = useSimulationStore.getState()
      updateContract(contract)
    },
    updateShanghaiIndex: (index: StoreShanghaiIndex) => {
      const { updateShanghaiIndex } = useSimulationStore.getState()
      updateShanghaiIndex(index)
    },
    updateHongkongIndex: (index: StoreHongKongIndex) => {
      const { updateHongkongIndex } = useSimulationStore.getState()
      updateHongkongIndex(index)
    }
  }
}