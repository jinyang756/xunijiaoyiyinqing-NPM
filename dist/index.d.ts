import * as mitt from 'mitt';
import { Emitter } from 'mitt';
import * as zustand from 'zustand';
import * as immer from 'immer';
import * as _supabase_supabase_js from '@supabase/supabase-js';

declare const bus: Emitter<{
    tick: Date;
    hourly: number;
    daily: Date;
    scheduler_start: Date;
    scheduler_stop: Date;
}>;
interface SchedulerOptions {
    virtualStepMin?: number;
    speed?: number;
}
declare class Scheduler {
    now: Date;
    timer?: number;
    opts: Required<SchedulerOptions>;
    constructor(startAt?: Date, opts?: SchedulerOptions);
    start(): void;
    stop(): void;
    tick(): void;
}

declare const eventBus: mitt.Emitter<Record<mitt.EventType, unknown>>;
type EventType = string | symbol;
type EventHandler<T = unknown> = (payload?: T) => void;

interface IpoStock {
    stock_id: string;
    stock_code: string;
    stock_name: string;
    issue_price: number;
    market_price: number;
    subscription_quota: number;
    subscribed_shares: number;
    win_rate: number;
    status: 'upcoming' | 'subscription' | 'allocated' | 'trading';
    listing_date: string;
}
declare class IpoEngine {
    stocks: IpoStock[];
    constructor();
    onSchedulerStart: () => void;
    generateHistoricalIpos(): void;
    onTick: (now: Date) => void;
    processSubscription(stock: IpoStock): void;
    subscribeToIpo(stockId: string, shares: number): boolean;
}

interface SeatTrade {
    trade_id: string;
    user_id: string;
    stock_code: string;
    stock_name: string;
    price: number;
    quantity: number;
    direction: 'buy' | 'sell';
    timestamp: string;
    fee: number;
    status: 'pending' | 'completed' | 'cancelled';
}
declare class SeatEngine {
    trades: SeatTrade[];
    constructor();
    onSchedulerStart: () => void;
    executeTrade(userId: string, stockCode: string, stockName: string, price: number, quantity: number, direction: 'buy' | 'sell'): string;
    getTradeHistory(userId: string): SeatTrade[];
}

interface BlockTrade {
    trade_id: string;
    stock_code: string;
    stock_name: string;
    price: number;
    quantity: number;
    buyer: string;
    seller: string;
    timestamp: string;
    discount_rate: number;
    status: 'pending' | 'completed' | 'cancelled';
}
declare class BlockEngine {
    trades: BlockTrade[];
    constructor();
    onSchedulerStart: () => void;
    generateHistoricalBlockTrades(): void;
    executeBlockTrade(stockCode: string, stockName: string, price: number, quantity: number, buyer: string, seller: string, discountRate: number): string;
    getBlockTrades(): BlockTrade[];
}

interface FundProduct {
    fund_code: string;
    fund_name: string;
    nav: number;
    strategy: string;
    volatility: number;
    manager: string;
    status: 'active' | 'closed';
}
interface FundTrade {
    trade_id: string;
    user_id: string;
    fund_code: string;
    fund_name: string;
    amount: number;
    shares: number;
    nav: number;
    timestamp: string;
    type: 'subscription' | 'redemption';
    fee: number;
    status: 'pending' | 'completed' | 'cancelled';
}
declare class FundEngine {
    products: FundProduct[];
    trades: FundTrade[];
    constructor();
    onSchedulerStart: () => void;
    onTick: (now: Date) => void;
    subscribeFund(userId: string, fundCode: string, amount: number): string | null;
    redeemFund(userId: string, fundCode: string, shares: number): string | null;
    getFundProducts(): FundProduct[];
    getUserTrades(userId: string): FundTrade[];
}

type ContractType = 'shanghai' | 'hongkong';
interface FundContract {
    contract_id: string;
    type: ContractType;
    strike_price: number;
    issue_time: string;
    expiration_time: string;
    duration: number;
    direction: 'call' | 'put';
    payout_multiplier: number;
    status: 'open' | 'won' | 'lost';
    auto_result?: 'win' | 'loss' | null;
    manual_result?: 'win' | 'loss' | null;
    profit?: number;
    cost: number;
    [key: string]: any;
}
interface ShanghaiIndex {
    current_price: number;
    last_updated: string;
    northbound_flow: number;
}
interface HongKongIndex {
    current_price: number;
    last_updated: string;
    southbound_flow: number;
}
declare class FundContractEngine {
    contracts: FundContract[];
    shanghaiIndex: ShanghaiIndex;
    hongkongIndex: HongKongIndex;
    shanghaiVolatility: number;
    hongkongVolatility: number;
    constructor();
    onSchedulerStart: () => void;
    generateHistoricalContracts(): void;
    generateContract(issueTime: Date, type: ContractType): void;
    onTick: (now: Date) => void;
    updateIndexPrices(now: Date): void;
    checkExpiringContracts(now: Date): void;
    expireContract(contract: FundContract): void;
    persistContract(contract: FundContract): Promise<void>;
    setContractResult(contract_id: string, result: 'win' | 'loss'): void;
}

interface FuturesContract {
    contract_id: string;
    symbol: string;
    expiry_date: string;
    price: number;
    quantity: number;
    leverage: number;
    status: 'open' | 'closed';
    pnl: number;
    timestamp: string;
}
declare class FuturesArbEngine {
    contracts: FuturesContract[];
    constructor();
    onSchedulerStart: () => void;
    onTick: (now: Date) => void;
    openPosition(symbol: string, price: number, quantity: number, leverage: number): string;
    closePosition(contractId: string): number;
    getOpenPositions(): FuturesContract[];
}

interface ETFProduct {
    etf_code: string;
    etf_name: string;
    nav: number;
    components: {
        symbol: string;
        shares: number;
    }[];
    creation_redemption_unit: number;
    status: 'active' | 'suspended';
}
interface ETFTrade {
    trade_id: string;
    user_id: string;
    etf_code: string;
    etf_name: string;
    quantity: number;
    amount: number;
    nav: number;
    timestamp: string;
    type: 'creation' | 'redemption';
    status: 'pending' | 'completed' | 'cancelled';
}
declare class ETFCreationEngine {
    products: ETFProduct[];
    trades: ETFTrade[];
    constructor();
    onSchedulerStart: () => void;
    onTick: (now: Date) => void;
    createETF(userId: string, etfCode: string, quantity: number): string | null;
    redeemETF(userId: string, etfCode: string, quantity: number): string | null;
    getETFProducts(): ETFProduct[];
    getUserTrades(userId: string): ETFTrade[];
}

interface OptionContract {
    option_id: string;
    underlying_symbol: string;
    strike_price: number;
    expiry_date: string;
    type: 'call' | 'put';
    premium: number;
    quantity: number;
    status: 'open' | 'exercised' | 'expired';
    pnl: number;
    timestamp: string;
}
declare class OptionsEngine {
    contracts: OptionContract[];
    constructor();
    onSchedulerStart: () => void;
    onTick: (now: Date) => void;
    createOption(underlyingSymbol: string, strikePrice: number, expiryDate: string, type: 'call' | 'put', premium: number, quantity: number): string;
    exerciseOption(optionId: string, underlyingPrice: number): number;
    expireOption(contract: OptionContract): void;
    getOpenOptions(): OptionContract[];
}

interface SimulationFundContract {
    contract_id: string;
    type: 'shanghai' | 'hongkong';
    strike_price: number;
    issue_time: string;
    expiration_time: string;
    duration: number;
    direction: 'call' | 'put';
    payout_multiplier: number;
    status: 'open' | 'won' | 'lost';
    cost: number;
    profit?: number;
    [key: string]: any;
}
interface StoreShanghaiIndex {
    current_price: number;
    last_updated: string;
    northbound_flow: number;
}
interface StoreHongKongIndex {
    current_price: number;
    last_updated: string;
    southbound_flow: number;
}
interface FundNav {
    fund_code: string;
    nav_date: string;
    value: number;
}
interface SimulationState {
    contracts: SimulationFundContract[];
    shanghaiIndex: StoreShanghaiIndex;
    hongkongIndex: StoreHongKongIndex;
    fundNavs: FundNav[];
    ipoWinRate: number;
    fundVolatilities: Record<string, number>;
    addContract: (contract: SimulationFundContract) => void;
    updateContract: (contract: SimulationFundContract) => void;
    updateShanghaiIndex: (index: StoreShanghaiIndex) => void;
    updateHongkongIndex: (index: StoreHongKongIndex) => void;
    addFundNav: (nav: FundNav) => void;
    setIpoWinRate: (rate: number) => void;
    setFundVolatility: (fundCode: string, volatility: number) => void;
    setContractResult: (contractId: string, result: 'win' | 'loss') => void;
}
declare const useSimulationStore: zustand.UseBoundStore<zustand.StoreApi<SimulationState>>;
declare const useContracts: () => SimulationFundContract[];
declare const useShanghaiIndex: () => StoreShanghaiIndex;
declare const useHongkongIndex: () => StoreHongKongIndex;
declare const useFundNavs: () => FundNav[];
declare const useIpoWinRate: () => number;
declare const useFundVolatilities: () => Record<string, number>;
declare const useContractById: (contractId: string) => SimulationFundContract | undefined;
declare const useFundNavByCode: (fundCode: string) => FundNav | undefined;

interface DemoAccount {
    user_id: string;
    username: string;
    balance: number;
    equity: number;
    positions: Array<Record<string, unknown>>;
    trades: Array<Record<string, unknown>>;
    pnl: number;
}
interface DemoAccountState {
    accounts: DemoAccount[];
    activeAccount: DemoAccount | null;
    initDemoAccount: () => void;
    getAccount: (user_id: string) => DemoAccount | undefined;
    updateAccount: (user_id: string, updates: Partial<DemoAccount>) => void;
    addTrade: (user_id: string, trade: Record<string, unknown>) => void;
    getUserBalance: (user_id: string) => number;
}
declare const useAccountStore: zustand.UseBoundStore<Omit<zustand.StoreApi<DemoAccountState>, "setState"> & {
    setState(nextStateOrUpdater: DemoAccountState | Partial<DemoAccountState> | ((state: immer.WritableDraft<DemoAccountState>) => void), shouldReplace?: boolean | undefined): void;
}>;
declare const useActiveAccount: () => DemoAccount | null;
declare const useAccounts: () => DemoAccount[];
declare const useUserBalance: (user_id: string) => number;

declare const randomInt: (min: number, max: number) => number;
declare const randomFloat: (min: number, max: number, decimals?: number) => number;
declare const randomBoolean: (probability?: number) => boolean;
declare const randomChoice: <T>(array: T[]) => T;
declare const randomShuffle: <T>(array: T[]) => T[];

declare const formatDate: (date: Date) => string;
declare const formatTime: (date: Date) => string;
declare const formatDateTime: (date: Date) => string;
declare const addMinutes: (date: Date, minutes: number) => Date;
declare const addHours: (date: Date, hours: number) => Date;
declare const addDays: (date: Date, days: number) => Date;
declare const isWeekend: (date: Date) => boolean;
declare const isWorkday: (date: Date) => boolean;

declare const exportToCSV: <T extends Record<string, any>>(data: T[], filename: string) => Promise<void>;
declare const exportFundContracts: () => void;
declare const exportTrades: () => void;

declare const initWebSocket: () => void;
declare const getSocket: () => any;
declare const disconnectWebSocket: () => void;

/**
 * 数据脱敏工具模块
 * 提供各种数据脱敏功能，保护用户隐私和敏感信息
 */
/**
 * 脱敏用户ID
 * @param userId 原始用户ID
 * @returns 脱敏后的用户ID
 */
declare const maskUserId: (userId: string) => string;
/**
 * 脱敏用户名
 * @param username 原始用户名
 * @returns 脱敏后的用户名
 */
declare const maskUsername: (username: string) => string;
/**
 * 脱敏账户余额
 * @param balance 原始余额
 * @param precision 保留小数位数
 * @returns 脱敏后的余额（只保留整数部分的前两位）
 */
declare const maskBalance: (balance: number, precision?: number) => string;
/**
 * 脱敏交易金额
 * @param amount 原始金额
 * @returns 脱敏后的金额
 */
declare const maskAmount: (amount: number) => string;
/**
 * 脱敏合约ID
 * @param contractId 原始合约ID
 * @returns 脱敏后的合约ID
 */
declare const maskContractId: (contractId: string) => string;
/**
 * 脱敏交易记录
 * @param trades 原始交易记录数组
 * @returns 脱敏后的交易记录数组
 */
declare const maskTrades: (trades: any[]) => any[];
/**
 * 脱敏账户信息
 * @param account 原始账户信息
 * @returns 脱敏后的账户信息
 */
declare const maskAccount: (account: any) => any;
/**
 * 脱敏合约信息
 * @param contract 原始合约信息
 * @returns 脱敏后的合约信息
 */
declare const maskContract: (contract: any) => any;
/**
 * 脱敏所有合约信息
 * @param contracts 原始合约数组
 * @returns 脱敏后的合约数组
 */
declare const maskContracts: (contracts: any[]) => any[];
/**
 * 脱敏指数信息
 * @param index 原始指数信息
 * @returns 脱敏后的指数信息
 */
declare const maskIndex: (index: any) => any;
/**
 * 启用数据脱敏模式
 * @param enable 是否启用脱敏
 */
declare const enableDataMasking: (enable?: boolean) => void;
/**
 * 检查是否启用了数据脱敏
 * @returns 是否启用了数据脱敏
 */
declare const isDataMaskingEnabled: () => boolean;

declare const supabase: _supabase_supabase_js.SupabaseClient<any, "public", "public", any, any>;
declare const initSupabase: () => Promise<void>;

interface Notification {
    title: string;
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
    [key: string]: any;
}
declare const notify: (title: string, message: string, type?: Notification["type"]) => void;
declare const requestNotificationPermission: () => void;

interface InitOptions {
    seed?: number;
    speed?: number;
    startAt?: Date;
    enableFundContract?: boolean;
    enableFutures?: boolean;
    enableETF?: boolean;
    enableOptions?: boolean;
    enableSupabase?: boolean;
    enableWebSocket?: boolean;
    demoAccount?: boolean;
}
declare const initSimulation: (opts?: InitOptions) => Scheduler;

export { BlockEngine, BlockTrade, ContractType, ETFCreationEngine, ETFProduct, ETFTrade, EventHandler, EventType, FundContract, FundContractEngine, FundEngine, FundNav, FundProduct, FundTrade, FuturesArbEngine, FuturesContract, HongKongIndex, IpoEngine, IpoStock, OptionContract, OptionsEngine, Scheduler, SchedulerOptions, SeatEngine, SeatTrade, ShanghaiIndex, StoreHongKongIndex, StoreShanghaiIndex, addDays, addHours, addMinutes, bus, disconnectWebSocket, enableDataMasking, eventBus, exportFundContracts, exportToCSV, exportTrades, formatDate, formatDateTime, formatTime, getSocket, initSimulation, initSupabase, initWebSocket, isDataMaskingEnabled, isWeekend, isWorkday, maskAccount, maskAmount, maskBalance, maskContract, maskContractId, maskContracts, maskIndex, maskTrades, maskUserId, maskUsername, notify, randomBoolean, randomChoice, randomFloat, randomInt, randomShuffle, requestNotificationPermission, supabase, useAccountStore, useAccounts, useActiveAccount, useContractById, useContracts, useFundNavByCode, useFundNavs, useFundVolatilities, useHongkongIndex, useIpoWinRate, useShanghaiIndex, useSimulationStore, useUserBalance };
