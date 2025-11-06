import { bus } from '../core/Scheduler'
import { add, format, isBefore, parseISO, differenceInMinutes } from 'date-fns'
import { nanoid } from 'nanoid'
import { useSimulationStore } from '../store/simulationStore'
import { notify } from '../services/notification'

export type ContractType = 'shanghai' | 'hongkong';

export interface FundContract {
  contract_id: string;
  type: ContractType;
  strike_price: number;   // at issuance
  issue_time: string;     // ISO string
  expiration_time: string; // ISO string (issue_time + duration)
  duration: number;       // in minutes: 5, 10, or 30
  direction: 'call' | 'put'; // up or down
  payout_multiplier: number; // fixed at 1.95
  status: 'open' | 'won' | 'lost';
  auto_result?: 'win' | 'loss' | null;
  manual_result?: 'win' | 'loss' | null;
  profit?: number;        // 计算盈利金额
  cost: number;           // 投入本金
  [key: string]: any;
}

export interface ShanghaiIndex {
  current_price: number;
  last_updated: string;
  northbound_flow: number;  // 北向资金流入
}

export interface HongKongIndex {
  current_price: number;
  last_updated: string;
  southbound_flow: number;  // 南向资金流入
}

export class FundContractEngine {
  contracts: FundContract[] = [];
  shanghaiIndex: ShanghaiIndex = {
    current_price: 3500.0,
    last_updated: new Date().toISOString(),
    northbound_flow: 5000000000  // 50亿北向资金
  };
  hongkongIndex: HongKongIndex = {
    current_price: 22000.0,
    last_updated: new Date().toISOString(),
    southbound_flow: 3000000000   // 30亿南向资金
  };

  shanghaiVolatility = 0.005; // 0.5% per day
  hongkongVolatility = 0.007; // 0.7% per day

  constructor() {
    this.generateHistoricalContracts();
    bus.on('tick', (now: Date) => this.onTick(now));
    bus.on('scheduler_start', this.onSchedulerStart);
  }

  onSchedulerStart = () => {
    // 实时推送新合约
    notify('基金合约引擎启动', '上海/香港合约交易已开始')
  }

  generateHistoricalContracts() {
    const start = new Date('2025-08-01T09:30:00');
    const end = new Date('2025-11-06T08:43:00');
    let current = start;

    while (isBefore(current, end)) {
      if (current.getDay() % 6 !== 0) { // 工作日
        // 每5-15分钟生成一次合约
        if (Math.random() < 0.2) {
          this.generateContract(current, 'shanghai');
        }
        if (Math.random() < 0.2) {
          this.generateContract(current, 'hongkong');
        }
      }
      current = add(current, { minutes: 5 });
    }
  }

  generateContract(issueTime: Date, type: ContractType) {
    const now = issueTime;
    const durations = [5, 10, 30];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const expiration = add(now, { minutes: duration });

    const currentPrice = type === 'shanghai' 
      ? this.shanghaiIndex.current_price 
      : this.hongkongIndex.current_price;

    const direction: 'call' | 'put' = Math.random() > 0.5 ? 'call' : 'put';
    const cost = Math.floor(1000 + Math.random() * 9000); // 1000-10000元本金

    const contract: FundContract = {
      contract_id: nanoid(),
      type,
      strike_price: currentPrice,
      issue_time: now.toISOString(),
      expiration_time: expiration.toISOString(),
      duration,
      direction,
      payout_multiplier: 1.95,
      status: 'open',
      cost
    };

    this.contracts.push(contract);
    // 通过zustand store更新状态
    const { addContract } = useSimulationStore.getState();
    addContract(contract);
    
    // 自动保存到Supabase
    this.persistContract(contract);
    
    // 通知
    notify('新合约生成', `${type === 'shanghai' ? '上证' : '恒生'}指数合约: ${direction === 'call' ? '看涨' : '看跌'}`)
  }

  onTick = (now: Date) => {
    this.updateIndexPrices(now);
    this.checkExpiringContracts(now);
    
    // 实时生成新合约
    if (Math.random() < 0.1) { 
      this.generateContract(now, Math.random() > 0.5 ? 'shanghai' : 'hongkong');
    }
  }

  updateIndexPrices(now: Date) {
    // 更新北向/南向资金流
    const northboundFlow = (this.shanghaiIndex.northbound_flow || 0) + Math.floor((Math.random() - 0.5) * 200000000);
    const southboundFlow = (this.hongkongIndex.southbound_flow || 0) + Math.floor((Math.random() - 0.5) * 150000000);

    // 更新价格（基于资金流影响）
    const shanghaiDrift = 1 + (Math.random() * 2 - 1) * this.shanghaiVolatility + (northboundFlow > 5000000000 ? 0.002 : -0.001);
    const hkDrift = 1 + (Math.random() * 2 - 1) * this.hongkongVolatility + (southboundFlow > 3000000000 ? 0.002 : -0.001);

    this.shanghaiIndex.current_price = +(this.shanghaiIndex.current_price * shanghaiDrift).toFixed(2);
    this.shanghaiIndex.northbound_flow = Math.max(0, northboundFlow);
    this.shanghaiIndex.last_updated = now.toISOString();

    this.hongkongIndex.current_price = +(this.hongkongIndex.current_price * hkDrift).toFixed(2);
    this.hongkongIndex.southbound_flow = Math.max(0, southboundFlow);
    this.hongkongIndex.last_updated = now.toISOString();

    // 通过zustand store更新状态
    const { updateShanghaiIndex, updateHongkongIndex } = useSimulationStore.getState();
    updateShanghaiIndex(this.shanghaiIndex);
    updateHongkongIndex(this.hongkongIndex);
  }

  checkExpiringContracts(now: Date) {
    this.contracts.forEach(contract => {
      if (contract.status === 'open' && isBefore(parseISO(contract.expiration_time), now)) {
        this.expireContract(contract);
      }
    });
  }

  expireContract(contract: FundContract) {
    const currentPrice = contract.type === 'shanghai'
      ? this.shanghaiIndex.current_price
      : this.hongkongIndex.current_price;

    let result: 'win' | 'loss';
    if (contract.direction === 'call') {
      result = currentPrice >= contract.strike_price ? 'win' : 'loss';
    } else {
      result = currentPrice <= contract.strike_price ? 'win' : 'loss';
    }

    // 手动设置优先
    if (contract.manual_result) {
      result = contract.manual_result;
    }

    contract.status = result === 'win' ? 'won' : 'lost';
    contract.auto_result = result;
    contract.profit = result === 'win' ? contract.cost * (contract.payout_multiplier - 1) : -contract.cost;

    // 通过zustand store更新状态
    const { updateContract } = useSimulationStore.getState();
    updateContract(contract);
    this.persistContract(contract);

    // 通知结算结果
    notify('合约结算', `${contract.type === 'shanghai' ? '上证' : '恒生'}合约 ${result === 'win' ? '盈利' : '亏损'} ¥${Math.abs(contract.profit)}`)
  }

  async persistContract(contract: FundContract) {
    // 动态导入supabase客户端以避免循环依赖
    const { getSupabaseClient } = await import('../services/supabase');
    const client = getSupabaseClient();
    
    if (!client) {
      console.warn('Supabase client not available');
      return;
    }
    
    try {
      await client.from('fund_contracts').insert({
        contract_id: contract.contract_id,
        type: contract.type,
        strike_price: contract.strike_price,
        issue_time: contract.issue_time,
        expiration_time: contract.expiration_time,
        duration: contract.duration,
        direction: contract.direction,
        payout_multiplier: contract.payout_multiplier,
        status: contract.status,
        cost: contract.cost,
        profit: contract.profit
      });
    } catch (error) {
      console.error('Failed to persist contract:', error);
    }
  }

  setContractResult(contract_id: string, result: 'win' | 'loss') {
    const contract = this.contracts.find(c => c.contract_id === contract_id);
    if (contract && contract.status === 'open') {
      contract.manual_result = result;
      this.expireContract(contract);
    }
  }
}