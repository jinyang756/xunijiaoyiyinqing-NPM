"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/supabase.ts
var supabase_exports = {};
__export(supabase_exports, {
  initSupabase: () => initSupabase,
  supabase: () => supabase
});
var import_supabase_js, SUPABASE_URL, SUPABASE_KEY, supabase, initSupabase, createTables;
var init_supabase = __esm({
  "src/services/supabase.ts"() {
    "use strict";
    import_supabase_js = require("@supabase/supabase-js");
    SUPABASE_URL = typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL || "";
    SUPABASE_KEY = typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY || "";
    if (typeof window !== "undefined" && !process.env?.VITE_SUPABASE_URL) {
      console.warn("\u26A0\uFE0F  Supabase URL \u672A\u914D\u7F6E\uFF0C\u8BF7\u8BBE\u7F6E VITE_SUPABASE_URL \u73AF\u5883\u53D8\u91CF");
    }
    if (typeof window !== "undefined" && !process.env?.VITE_SUPABASE_ANON_KEY) {
      console.warn("\u26A0\uFE0F  Supabase Key \u672A\u914D\u7F6E\uFF0C\u8BF7\u8BBE\u7F6E VITE_SUPABASE_ANON_KEY \u73AF\u5883\u53D8\u91CF");
    }
    supabase = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_KEY);
    initSupabase = async () => {
      await createTables();
      console.log("\u2705 Supabase initialized");
    };
    createTables = async () => {
      try {
        await supabase.rpc("create_fund_contracts_table");
      } catch (error) {
        console.log("Fund contracts table may already exist");
      }
      try {
        await supabase.rpc("create_trades_table");
      } catch (error) {
        console.log("Trades table may already exist");
      }
      try {
        await supabase.rpc("create_accounts_table");
      } catch (error) {
        console.log("Accounts table may already exist");
      }
    };
  }
});

// src/store/accountStore.ts
var accountStore_exports = {};
__export(accountStore_exports, {
  useAccountStore: () => useAccountStore
});
var import_zustand2, useAccountStore;
var init_accountStore = __esm({
  "src/store/accountStore.ts"() {
    "use strict";
    import_zustand2 = require("zustand");
    useAccountStore = (0, import_zustand2.create)()((set, get) => ({
      accounts: [],
      activeAccount: null,
      initDemoAccount: () => {
        const demoAccount = {
          user_id: "demo_001",
          username: "\u6F14\u793A\u7528\u6237",
          balance: 1e5,
          // 10万起始资金
          equity: 1e5,
          positions: [],
          trades: [],
          pnl: 0
        };
        set((state) => ({
          accounts: [...state.accounts, demoAccount],
          activeAccount: demoAccount
        }));
        window.demoAccountStore = get();
      },
      getAccount: (user_id) => {
        return get().accounts.find((account) => account.user_id === user_id);
      },
      updateAccount: (user_id, updates) => {
        set((state) => ({
          accounts: state.accounts.map(
            (account) => account.user_id === user_id ? { ...account, ...updates } : account
          )
        }));
      },
      addTrade: (user_id, trade) => {
        const account = get().getAccount(user_id);
        if (account) {
          const updatedTrades = [...account.trades, trade];
          get().updateAccount(user_id, { trades: updatedTrades });
        }
      },
      getUserBalance: (user_id) => {
        const account = get().getAccount(user_id);
        return account ? account.balance : 0;
      }
    }));
    if (typeof window !== "undefined") {
      window.initDemoAccount = () => {
        const { initDemoAccount } = useAccountStore.getState();
        initDemoAccount();
      };
    }
  }
});

// src/utils/websocket.ts
var websocket_exports = {};
__export(websocket_exports, {
  disconnectWebSocket: () => disconnectWebSocket,
  getSocket: () => getSocket,
  initWebSocket: () => initWebSocket
});
var socket, initWebSocket, getSocket, disconnectWebSocket;
var init_websocket = __esm({
  "src/utils/websocket.ts"() {
    "use strict";
    socket = null;
    initWebSocket = () => {
      console.log("\u{1F50C} WebSocket initialized");
      window.addEventListener("simulation-notification", (event) => {
        console.log("\u{1F4E1} WebSocket send:", event.detail);
      });
    };
    getSocket = () => socket;
    disconnectWebSocket = () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BlockEngine: () => BlockEngine,
  ETFCreationEngine: () => ETFCreationEngine,
  FundContractEngine: () => FundContractEngine,
  FundEngine: () => FundEngine,
  FuturesArbEngine: () => FuturesArbEngine,
  IpoEngine: () => IpoEngine,
  OptionsEngine: () => OptionsEngine,
  Scheduler: () => Scheduler,
  SeatEngine: () => SeatEngine,
  addDays: () => addDays,
  addHours: () => addHours,
  addMinutes: () => addMinutes,
  bus: () => bus,
  disconnectWebSocket: () => disconnectWebSocket,
  enableDataMasking: () => enableDataMasking,
  eventBus: () => eventBus,
  exportFundContracts: () => exportFundContracts,
  exportToCSV: () => exportToCSV,
  exportTrades: () => exportTrades,
  formatDate: () => formatDate,
  formatDateTime: () => formatDateTime,
  formatTime: () => formatTime,
  getSocket: () => getSocket,
  initSimulation: () => initSimulation,
  initSupabase: () => initSupabase,
  initWebSocket: () => initWebSocket,
  isDataMaskingEnabled: () => isDataMaskingEnabled,
  isWeekend: () => isWeekend,
  isWorkday: () => isWorkday,
  maskAccount: () => maskAccount,
  maskAmount: () => maskAmount,
  maskBalance: () => maskBalance,
  maskContract: () => maskContract,
  maskContractId: () => maskContractId,
  maskContracts: () => maskContracts,
  maskIndex: () => maskIndex,
  maskTrades: () => maskTrades,
  maskUserId: () => maskUserId,
  maskUsername: () => maskUsername,
  notify: () => notify,
  randomBoolean: () => randomBoolean,
  randomChoice: () => randomChoice,
  randomFloat: () => randomFloat,
  randomInt: () => randomInt,
  randomShuffle: () => randomShuffle,
  requestNotificationPermission: () => requestNotificationPermission,
  supabase: () => supabase,
  useAccountStore: () => useAccountStore,
  useSimulationStore: () => useSimulationStore
});
module.exports = __toCommonJS(src_exports);

// src/core/Scheduler.ts
var import_date_fns = require("date-fns");
var import_mitt = __toESM(require("mitt"));
var bus = (0, import_mitt.default)();
var Scheduler = class {
  constructor(startAt = /* @__PURE__ */ new Date(), opts) {
    this.now = startAt;
    this.opts = { virtualStepMin: 1, speed: 60, ...opts };
  }
  start() {
    if (this.timer)
      return;
    this.timer = window.setInterval(() => this.tick(), 1e3 / this.opts.speed);
    bus.emit("scheduler_start", this.now);
  }
  stop() {
    clearInterval(this.timer);
    this.timer = void 0;
    bus.emit("scheduler_stop", this.now);
  }
  tick() {
    this.now = (0, import_date_fns.add)(this.now, { minutes: this.opts.virtualStepMin });
    bus.emit("tick", this.now);
    bus.emit("hourly", this.now.getHours());
    bus.emit("daily", this.now);
  }
};

// src/core/EventBus.ts
var import_mitt2 = __toESM(require("mitt"));
var eventBus = (0, import_mitt2.default)();

// src/engines/ipo.ts
var import_nanoid = require("nanoid");

// src/services/notification.ts
var notify = (title, message, type = "info") => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "/favicon.ico"
    });
  }
  const event = new CustomEvent("simulation-notification", {
    detail: { title, message, type, timestamp: (/* @__PURE__ */ new Date()).toISOString() }
  });
  window.dispatchEvent(event);
};
var requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};

// src/engines/ipo.ts
var IpoEngine = class {
  constructor() {
    this.stocks = [];
    this.onSchedulerStart = () => {
      notify("\u65B0\u80A1\u7533\u8D2D\u5F15\u64CE\u542F\u52A8", "\u65B0\u80A1\u7533\u8D2D\u529F\u80FD\u5DF2\u542F\u7528");
    };
    this.onTick = (now) => {
      this.stocks.forEach((stock) => {
        if (stock.status === "subscription") {
          if (Math.random() < 0.1) {
            this.processSubscription(stock);
          }
        }
      });
    };
    this.generateHistoricalIpos();
    bus.on("tick", (now) => this.onTick(now));
    bus.on("scheduler_start", this.onSchedulerStart);
  }
  generateHistoricalIpos() {
    const historicalIpos = [
      {
        stock_id: (0, import_nanoid.nanoid)(),
        stock_code: "600100",
        stock_name: "\u540C\u65B9\u80A1\u4EFD",
        issue_price: 6.28,
        market_price: 8.5,
        subscription_quota: 1e4,
        subscribed_shares: 0,
        win_rate: 5e-3,
        status: "trading",
        listing_date: "2025-08-15"
      },
      {
        stock_id: (0, import_nanoid.nanoid)(),
        stock_code: "600111",
        stock_name: "\u5317\u65B9\u7A00\u571F",
        issue_price: 12.65,
        market_price: 15.2,
        subscription_quota: 8e3,
        subscribed_shares: 0,
        win_rate: 3e-3,
        status: "trading",
        listing_date: "2025-08-22"
      }
    ];
    this.stocks = historicalIpos;
  }
  processSubscription(stock) {
    const win = Math.random() < stock.win_rate;
    if (win) {
      stock.subscribed_shares = Math.floor(Math.random() * 1e3) + 100;
      stock.status = "allocated";
      notify("\u65B0\u80A1\u7533\u8D2D\u6210\u529F", `${stock.stock_name} \u7533\u8D2D\u6210\u529F\uFF0C\u83B7\u5F97 ${stock.subscribed_shares} \u80A1`);
    } else {
      stock.status = "allocated";
      notify("\u65B0\u80A1\u7533\u8D2D\u7ED3\u679C", `${stock.stock_name} \u7533\u8D2D\u672A\u4E2D\u7B7E`);
    }
  }
  subscribeToIpo(stockId, shares) {
    const stock = this.stocks.find((s) => s.stock_id === stockId);
    if (stock && stock.status === "subscription") {
      notify("\u7533\u8D2D\u63D0\u4EA4", `\u5DF2\u63D0\u4EA4 ${stock.stock_name} \u7684\u7533\u8D2D\u8BF7\u6C42`);
      return true;
    }
    return false;
  }
};

// src/engines/seat.ts
var import_nanoid2 = require("nanoid");
var SeatEngine = class {
  constructor() {
    this.trades = [];
    this.onSchedulerStart = () => {
      notify("\u673A\u6784\u5E2D\u4F4D\u5F15\u64CE\u542F\u52A8", "\u673A\u6784\u5E2D\u4F4D\u4EA4\u6613\u529F\u80FD\u5DF2\u542F\u7528");
    };
    bus.on("scheduler_start", this.onSchedulerStart);
  }
  executeTrade(userId, stockCode, stockName, price, quantity, direction) {
    const trade = {
      trade_id: (0, import_nanoid2.nanoid)(),
      user_id: userId,
      stock_code: stockCode,
      stock_name: stockName,
      price,
      quantity,
      direction,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      fee: price * quantity * 5e-4,
      // 万5手续费
      status: "completed"
    };
    this.trades.push(trade);
    notify("\u673A\u6784\u5E2D\u4F4D\u4EA4\u6613", `${direction === "buy" ? "\u4E70\u5165" : "\u5356\u51FA"} ${stockName} ${quantity}\u80A1\uFF0C\u4EF7\u683C\xA5${price}`);
    return trade.trade_id;
  }
  getTradeHistory(userId) {
    return this.trades.filter((trade) => trade.user_id === userId);
  }
};

// src/engines/block.ts
var import_nanoid3 = require("nanoid");
var BlockEngine = class {
  constructor() {
    this.trades = [];
    this.onSchedulerStart = () => {
      notify("\u5927\u5B97\u4EA4\u6613\u5F15\u64CE\u542F\u52A8", "\u5927\u5B97\u4EA4\u6613\u529F\u80FD\u5DF2\u542F\u7528");
    };
    this.generateHistoricalBlockTrades();
    bus.on("scheduler_start", this.onSchedulerStart);
  }
  generateHistoricalBlockTrades() {
    const historicalTrades = [
      {
        trade_id: (0, import_nanoid3.nanoid)(),
        stock_code: "600036",
        stock_name: "\u62DB\u5546\u94F6\u884C",
        price: 35.2,
        quantity: 1e6,
        buyer: "\u673A\u6784A",
        seller: "\u673A\u6784B",
        timestamp: "2025-08-10T10:30:00",
        discount_rate: 0.02,
        status: "completed"
      }
    ];
    this.trades = historicalTrades;
  }
  executeBlockTrade(stockCode, stockName, price, quantity, buyer, seller, discountRate) {
    const trade = {
      trade_id: (0, import_nanoid3.nanoid)(),
      stock_code: stockCode,
      stock_name: stockName,
      price,
      quantity,
      buyer,
      seller,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      discount_rate: discountRate,
      status: "completed"
    };
    this.trades.push(trade);
    notify("\u5927\u5B97\u4EA4\u6613", `${stockName} ${quantity}\u80A1\u5927\u5B97\u4EA4\u6613\u5B8C\u6210\uFF0C\u6298\u4EF7\u7387${(discountRate * 100).toFixed(2)}%`);
    return trade.trade_id;
  }
  getBlockTrades() {
    return this.trades;
  }
};

// src/engines/fund.ts
var import_nanoid4 = require("nanoid");
var FundEngine = class {
  constructor() {
    this.products = [
      {
        fund_code: "JCF-CTA-001",
        fund_name: "\u91CF\u5316CTA\u4E00\u53F7",
        nav: 1.2567,
        strategy: "CTA",
        volatility: 0.015,
        manager: "\u5F20\u4E09",
        status: "active"
      },
      {
        fund_code: "JCF-QM-002",
        fund_name: "\u91CF\u5316\u591A\u56E0\u5B50\u4E8C\u53F7",
        nav: 1.1892,
        strategy: "\u591A\u56E0\u5B50",
        volatility: 0.012,
        manager: "\u674E\u56DB",
        status: "active"
      },
      {
        fund_code: "JCF-ARBITRAGE-003",
        fund_name: "\u7EDF\u8BA1\u5957\u5229\u4E09\u53F7",
        nav: 1.3421,
        strategy: "\u7EDF\u8BA1\u5957\u5229",
        volatility: 8e-3,
        manager: "\u738B\u4E94",
        status: "active"
      },
      {
        fund_code: "JCF-ALPHA-004",
        fund_name: "AI\u963F\u5C14\u6CD5\u56DB\u53F7",
        nav: 1.4563,
        strategy: "AI\u963F\u5C14\u6CD5",
        volatility: 0.02,
        manager: "\u8D75\u516D",
        status: "active"
      },
      {
        fund_code: "JCF-BOND-005",
        fund_name: "\u56FA\u6536\u589E\u5F3A\u4E94\u53F7",
        nav: 1.0897,
        strategy: "\u56FA\u6536\u589E\u5F3A",
        volatility: 5e-3,
        manager: "\u5B59\u4E03",
        status: "active"
      }
    ];
    this.trades = [];
    this.onSchedulerStart = () => {
      notify("\u79C1\u52DF\u57FA\u91D1\u5F15\u64CE\u542F\u52A8", "\u79C1\u52DF\u57FA\u91D1\u4EA4\u6613\u529F\u80FD\u5DF2\u542F\u7528");
    };
    this.onTick = (now) => {
      this.products.forEach((product) => {
        if (product.status === "active") {
          const drift = 1 + (Math.random() * 2 - 1) * product.volatility;
          product.nav = +(product.nav * drift).toFixed(4);
        }
      });
    };
    bus.on("scheduler_start", this.onSchedulerStart);
    bus.on("tick", (now) => this.onTick(now));
  }
  subscribeFund(userId, fundCode, amount) {
    const fund = this.products.find((f) => f.fund_code === fundCode);
    if (!fund || fund.status !== "active") {
      notify("\u57FA\u91D1\u7533\u8D2D\u5931\u8D25", "\u57FA\u91D1\u4E0D\u5B58\u5728\u6216\u5DF2\u5173\u95ED");
      return null;
    }
    const shares = amount / fund.nav;
    const fee = amount * 0.01;
    const trade = {
      trade_id: (0, import_nanoid4.nanoid)(),
      user_id: userId,
      fund_code: fundCode,
      fund_name: fund.fund_name,
      amount,
      shares,
      nav: fund.nav,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type: "subscription",
      fee,
      status: "completed"
    };
    this.trades.push(trade);
    notify("\u57FA\u91D1\u7533\u8D2D", `\u6210\u529F\u7533\u8D2D${fund.fund_name} ${shares.toFixed(2)}\u4EFD\uFF0C\u91D1\u989D\xA5${amount}`);
    return trade.trade_id;
  }
  redeemFund(userId, fundCode, shares) {
    const fund = this.products.find((f) => f.fund_code === fundCode);
    if (!fund || fund.status !== "active") {
      notify("\u57FA\u91D1\u8D4E\u56DE\u5931\u8D25", "\u57FA\u91D1\u4E0D\u5B58\u5728\u6216\u5DF2\u5173\u95ED");
      return null;
    }
    const amount = shares * fund.nav;
    const fee = amount * 5e-3;
    const trade = {
      trade_id: (0, import_nanoid4.nanoid)(),
      user_id: userId,
      fund_code: fundCode,
      fund_name: fund.fund_name,
      amount,
      shares,
      nav: fund.nav,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type: "redemption",
      fee,
      status: "completed"
    };
    this.trades.push(trade);
    notify("\u57FA\u91D1\u8D4E\u56DE", `\u6210\u529F\u8D4E\u56DE${fund.fund_name} ${shares.toFixed(2)}\u4EFD\uFF0C\u5230\u8D26\xA5${(amount - fee).toFixed(2)}`);
    return trade.trade_id;
  }
  getFundProducts() {
    return this.products;
  }
  getUserTrades(userId) {
    return this.trades.filter((trade) => trade.user_id === userId);
  }
};

// src/engines/fundContract.ts
var import_date_fns2 = require("date-fns");
var import_nanoid5 = require("nanoid");

// src/store/simulationStore.ts
var import_zustand = require("zustand");
var useSimulationStore = (0, import_zustand.create)()((set, get) => ({
  // 初始状态
  contracts: [],
  shanghaiIndex: {
    current_price: 3500,
    last_updated: (/* @__PURE__ */ new Date()).toISOString(),
    northbound_flow: 5e9
  },
  hongkongIndex: {
    current_price: 22e3,
    last_updated: (/* @__PURE__ */ new Date()).toISOString(),
    southbound_flow: 3e9
  },
  fundNavs: [],
  ipoWinRate: 5e-3,
  fundVolatilities: {
    "JCF-CTA-001": 0.015,
    "JCF-QM-002": 0.012,
    "JCF-ARBITRAGE-003": 8e-3,
    "JCF-ALPHA-004": 0.02,
    "JCF-BOND-005": 5e-3
  },
  // 操作函数实现
  addContract: (contract) => set((state) => ({
    contracts: [...state.contracts, contract]
  })),
  updateContract: (contract) => set((state) => ({
    contracts: state.contracts.map(
      (c) => c.contract_id === contract.contract_id ? contract : c
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
    contracts: state.contracts.map((contract) => {
      if (contract.contract_id === contractId && contract.status === "open") {
        const newStatus = result === "win" ? "won" : "lost";
        const profit = result === "win" ? contract.cost * (contract.payout_multiplier - 1) : -contract.cost;
        return {
          ...contract,
          status: newStatus,
          profit
        };
      }
      return contract;
    })
  }))
}));
if (typeof window !== "undefined") {
  window.simStore = {
    addContract: (contract) => {
      const { addContract } = useSimulationStore.getState();
      addContract(contract);
    },
    updateContract: (contract) => {
      const { updateContract } = useSimulationStore.getState();
      updateContract(contract);
    },
    updateShanghaiIndex: (index) => {
      const { updateShanghaiIndex } = useSimulationStore.getState();
      updateShanghaiIndex(index);
    },
    updateHongkongIndex: (index) => {
      const { updateHongkongIndex } = useSimulationStore.getState();
      updateHongkongIndex(index);
    }
  };
}

// src/engines/fundContract.ts
init_supabase();
var FundContractEngine = class {
  // 0.7% per day
  constructor() {
    this.contracts = [];
    this.shanghaiIndex = {
      current_price: 3500,
      last_updated: (/* @__PURE__ */ new Date()).toISOString(),
      northbound_flow: 5e9
      // 50亿北向资金
    };
    this.hongkongIndex = {
      current_price: 22e3,
      last_updated: (/* @__PURE__ */ new Date()).toISOString(),
      southbound_flow: 3e9
      // 30亿南向资金
    };
    this.shanghaiVolatility = 5e-3;
    // 0.5% per day
    this.hongkongVolatility = 7e-3;
    this.onSchedulerStart = () => {
      notify("\u57FA\u91D1\u5408\u7EA6\u5F15\u64CE\u542F\u52A8", "\u4E0A\u6D77/\u9999\u6E2F\u5408\u7EA6\u4EA4\u6613\u5DF2\u5F00\u59CB");
    };
    this.onTick = (now) => {
      this.updateIndexPrices(now);
      this.checkExpiringContracts(now);
      if (Math.random() < 0.1) {
        this.generateContract(now, Math.random() > 0.5 ? "shanghai" : "hongkong");
      }
    };
    this.generateHistoricalContracts();
    bus.on("tick", (now) => this.onTick(now));
    bus.on("scheduler_start", this.onSchedulerStart);
  }
  generateHistoricalContracts() {
    const start = /* @__PURE__ */ new Date("2025-08-01T09:30:00");
    const end = /* @__PURE__ */ new Date("2025-11-06T08:43:00");
    let current = start;
    while ((0, import_date_fns2.isBefore)(current, end)) {
      if (current.getDay() % 6 !== 0) {
        if (Math.random() < 0.2) {
          this.generateContract(current, "shanghai");
        }
        if (Math.random() < 0.2) {
          this.generateContract(current, "hongkong");
        }
      }
      current = (0, import_date_fns2.add)(current, { minutes: 5 });
    }
  }
  generateContract(issueTime, type) {
    const now = issueTime;
    const durations = [5, 10, 30];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const expiration = (0, import_date_fns2.add)(now, { minutes: duration });
    const currentPrice = type === "shanghai" ? this.shanghaiIndex.current_price : this.hongkongIndex.current_price;
    const direction = Math.random() > 0.5 ? "call" : "put";
    const cost = Math.floor(1e3 + Math.random() * 9e3);
    const contract = {
      contract_id: (0, import_nanoid5.nanoid)(),
      type,
      strike_price: currentPrice,
      issue_time: now.toISOString(),
      expiration_time: expiration.toISOString(),
      duration,
      direction,
      payout_multiplier: 1.95,
      status: "open",
      cost
    };
    this.contracts.push(contract);
    const { addContract } = useSimulationStore.getState();
    addContract(contract);
    this.persistContract(contract);
    notify("\u65B0\u5408\u7EA6\u751F\u6210", `${type === "shanghai" ? "\u4E0A\u8BC1" : "\u6052\u751F"}\u6307\u6570\u5408\u7EA6: ${direction === "call" ? "\u770B\u6DA8" : "\u770B\u8DCC"}`);
  }
  updateIndexPrices(now) {
    const northboundFlow = (this.shanghaiIndex.northbound_flow || 0) + Math.floor((Math.random() - 0.5) * 2e8);
    const southboundFlow = (this.hongkongIndex.southbound_flow || 0) + Math.floor((Math.random() - 0.5) * 15e7);
    const shanghaiDrift = 1 + (Math.random() * 2 - 1) * this.shanghaiVolatility + (northboundFlow > 5e9 ? 2e-3 : -1e-3);
    const hkDrift = 1 + (Math.random() * 2 - 1) * this.hongkongVolatility + (southboundFlow > 3e9 ? 2e-3 : -1e-3);
    this.shanghaiIndex.current_price = +(this.shanghaiIndex.current_price * shanghaiDrift).toFixed(2);
    this.shanghaiIndex.northbound_flow = Math.max(0, northboundFlow);
    this.shanghaiIndex.last_updated = now.toISOString();
    this.hongkongIndex.current_price = +(this.hongkongIndex.current_price * hkDrift).toFixed(2);
    this.hongkongIndex.southbound_flow = Math.max(0, southboundFlow);
    this.hongkongIndex.last_updated = now.toISOString();
    const { updateShanghaiIndex, updateHongkongIndex } = useSimulationStore.getState();
    updateShanghaiIndex(this.shanghaiIndex);
    updateHongkongIndex(this.hongkongIndex);
  }
  checkExpiringContracts(now) {
    this.contracts.forEach((contract) => {
      if (contract.status === "open" && (0, import_date_fns2.isBefore)((0, import_date_fns2.parseISO)(contract.expiration_time), now)) {
        this.expireContract(contract);
      }
    });
  }
  expireContract(contract) {
    const currentPrice = contract.type === "shanghai" ? this.shanghaiIndex.current_price : this.hongkongIndex.current_price;
    let result;
    if (contract.direction === "call") {
      result = currentPrice >= contract.strike_price ? "win" : "loss";
    } else {
      result = currentPrice <= contract.strike_price ? "win" : "loss";
    }
    if (contract.manual_result) {
      result = contract.manual_result;
    }
    contract.status = result === "win" ? "won" : "lost";
    contract.auto_result = result;
    contract.profit = result === "win" ? contract.cost * (contract.payout_multiplier - 1) : -contract.cost;
    const { updateContract } = useSimulationStore.getState();
    updateContract(contract);
    this.persistContract(contract);
    notify("\u5408\u7EA6\u7ED3\u7B97", `${contract.type === "shanghai" ? "\u4E0A\u8BC1" : "\u6052\u751F"}\u5408\u7EA6 ${result === "win" ? "\u76C8\u5229" : "\u4E8F\u635F"} \xA5${Math.abs(contract.profit)}`);
  }
  async persistContract(contract) {
    try {
      await supabase.from("fund_contracts").insert({
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
      console.error("Failed to persist contract:", error);
    }
  }
  setContractResult(contract_id, result) {
    const contract = this.contracts.find((c) => c.contract_id === contract_id);
    if (contract && contract.status === "open") {
      contract.manual_result = result;
      this.expireContract(contract);
    }
  }
};

// src/engines/futuresArb.ts
var import_nanoid6 = require("nanoid");
var FuturesArbEngine = class {
  constructor() {
    this.contracts = [];
    this.onSchedulerStart = () => {
      notify("\u671F\u8D27\u5957\u5229\u5F15\u64CE\u542F\u52A8", "\u671F\u8D27\u5957\u5229\u4EA4\u6613\u529F\u80FD\u5DF2\u542F\u7528");
    };
    this.onTick = (now) => {
      this.contracts.forEach((contract) => {
        if (contract.status === "open") {
          const priceChange = (Math.random() * 2 - 1) * 5e-3;
          const newPrice = contract.price * (1 + priceChange);
          contract.pnl = (newPrice - contract.price) * contract.quantity * contract.leverage;
          contract.price = newPrice;
        }
      });
    };
    bus.on("scheduler_start", this.onSchedulerStart);
    bus.on("tick", (now) => this.onTick(now));
  }
  openPosition(symbol, price, quantity, leverage) {
    const contract = {
      contract_id: (0, import_nanoid6.nanoid)(),
      symbol,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString(),
      // 30天后到期
      price,
      quantity,
      leverage,
      status: "open",
      pnl: 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.contracts.push(contract);
    notify("\u671F\u8D27\u5F00\u4ED3", `\u5F00\u4ED3${symbol} ${quantity}\u624B\uFF0C\u4EF7\u683C${price}\uFF0C\u6760\u6746${leverage}\u500D`);
    return contract.contract_id;
  }
  closePosition(contractId) {
    const contract = this.contracts.find((c) => c.contract_id === contractId);
    if (contract && contract.status === "open") {
      contract.status = "closed";
      notify("\u671F\u8D27\u5E73\u4ED3", `\u5E73\u4ED3${contract.symbol}\uFF0C\u76C8\u4E8F\xA5${contract.pnl.toFixed(2)}`);
      return contract.pnl;
    }
    return 0;
  }
  getOpenPositions() {
    return this.contracts.filter((c) => c.status === "open");
  }
};

// src/engines/etfCreation.ts
var import_nanoid7 = require("nanoid");
var ETFCreationEngine = class {
  constructor() {
    this.products = [
      {
        etf_code: "510310",
        etf_name: "\u6CAA\u6DF1300ETF",
        nav: 3.856,
        components: [
          { symbol: "600036", shares: 10 },
          { symbol: "600037", shares: 8 },
          { symbol: "600038", shares: 5 }
        ],
        creation_redemption_unit: 1e6,
        status: "active"
      }
    ];
    this.trades = [];
    this.onSchedulerStart = () => {
      notify("ETF\u7533\u8D4E\u5F15\u64CE\u542F\u52A8", "ETF\u7533\u8D2D\u8D4E\u56DE\u529F\u80FD\u5DF2\u542F\u7528");
    };
    this.onTick = (now) => {
      this.products.forEach((etf) => {
        if (etf.status === "active") {
          const drift = 1 + (Math.random() * 2 - 1) * 2e-3;
          etf.nav = +(etf.nav * drift).toFixed(4);
        }
      });
    };
    bus.on("scheduler_start", this.onSchedulerStart);
    bus.on("tick", (now) => this.onTick(now));
  }
  createETF(userId, etfCode, quantity) {
    const etf = this.products.find((e) => e.etf_code === etfCode);
    if (!etf || etf.status !== "active") {
      notify("ETF\u7533\u8D2D\u5931\u8D25", "ETF\u4E0D\u5B58\u5728\u6216\u5DF2\u6682\u505C\u4EA4\u6613");
      return null;
    }
    const amount = quantity * etf.nav;
    const trade = {
      trade_id: (0, import_nanoid7.nanoid)(),
      user_id: userId,
      etf_code: etfCode,
      etf_name: etf.etf_name,
      quantity,
      amount,
      nav: etf.nav,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type: "creation",
      status: "completed"
    };
    this.trades.push(trade);
    notify("ETF\u7533\u8D2D", `\u6210\u529F\u7533\u8D2D${etf.etf_name} ${quantity}\u4EFD\uFF0C\u91D1\u989D\xA5${amount.toFixed(2)}`);
    return trade.trade_id;
  }
  redeemETF(userId, etfCode, quantity) {
    const etf = this.products.find((e) => e.etf_code === etfCode);
    if (!etf || etf.status !== "active") {
      notify("ETF\u8D4E\u56DE\u5931\u8D25", "ETF\u4E0D\u5B58\u5728\u6216\u5DF2\u6682\u505C\u4EA4\u6613");
      return null;
    }
    const amount = quantity * etf.nav;
    const trade = {
      trade_id: (0, import_nanoid7.nanoid)(),
      user_id: userId,
      etf_code: etfCode,
      etf_name: etf.etf_name,
      quantity,
      amount,
      nav: etf.nav,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type: "redemption",
      status: "completed"
    };
    this.trades.push(trade);
    notify("ETF\u8D4E\u56DE", `\u6210\u529F\u8D4E\u56DE${etf.etf_name} ${quantity}\u4EFD\uFF0C\u5230\u8D26\xA5${amount.toFixed(2)}`);
    return trade.trade_id;
  }
  getETFProducts() {
    return this.products;
  }
  getUserTrades(userId) {
    return this.trades.filter((trade) => trade.user_id === userId);
  }
};

// src/engines/options.ts
var import_nanoid8 = require("nanoid");
var OptionsEngine = class {
  constructor() {
    this.contracts = [];
    this.onSchedulerStart = () => {
      notify("\u671F\u6743\u7B56\u7565\u5F15\u64CE\u542F\u52A8", "\u671F\u6743\u4EA4\u6613\u529F\u80FD\u5DF2\u542F\u7528");
    };
    this.onTick = (now) => {
      this.contracts.forEach((contract) => {
        if (contract.status === "open") {
          const expiryDate = new Date(contract.expiry_date);
          if (now >= expiryDate) {
            this.expireOption(contract);
          }
        }
      });
    };
    bus.on("scheduler_start", this.onSchedulerStart);
    bus.on("tick", (now) => this.onTick(now));
  }
  createOption(underlyingSymbol, strikePrice, expiryDate, type, premium, quantity) {
    const contract = {
      option_id: (0, import_nanoid8.nanoid)(),
      underlying_symbol: underlyingSymbol,
      strike_price: strikePrice,
      expiry_date: expiryDate,
      type,
      premium,
      quantity,
      status: "open",
      pnl: -premium * quantity,
      // 初始为负的期权费
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.contracts.push(contract);
    notify("\u671F\u6743\u5F00\u4ED3", `\u5F00\u4ED3${type === "call" ? "\u770B\u6DA8" : "\u770B\u8DCC"}\u671F\u6743 ${underlyingSymbol}\uFF0C\u884C\u6743\u4EF7${strikePrice}\uFF0C\u6743\u5229\u91D1\xA5${premium}`);
    return contract.option_id;
  }
  exerciseOption(optionId, underlyingPrice) {
    const contract = this.contracts.find((c) => c.option_id === optionId);
    if (contract && contract.status === "open") {
      let payoff = 0;
      if (contract.type === "call") {
        payoff = Math.max(0, underlyingPrice - contract.strike_price) * contract.quantity;
      } else {
        payoff = Math.max(0, contract.strike_price - underlyingPrice) * contract.quantity;
      }
      contract.pnl = payoff - contract.premium * contract.quantity;
      contract.status = "exercised";
      notify("\u671F\u6743\u884C\u6743", `${contract.type === "call" ? "\u770B\u6DA8" : "\u770B\u8DCC"}\u671F\u6743\u884C\u6743\uFF0C\u76C8\u4E8F\xA5${contract.pnl.toFixed(2)}`);
      return contract.pnl;
    }
    return 0;
  }
  expireOption(contract) {
    if (contract.status === "open") {
      contract.status = "expired";
      notify("\u671F\u6743\u5230\u671F", `${contract.underlying_symbol}\u671F\u6743\u5230\u671F\uFF0C\u635F\u5931\u6743\u5229\u91D1\xA5${(contract.premium * contract.quantity).toFixed(2)}`);
    }
  }
  getOpenOptions() {
    return this.contracts.filter((c) => c.status === "open");
  }
};

// src/index.ts
init_accountStore();

// src/utils/random.ts
var randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var randomFloat = (min, max, decimals = 2) => {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(decimals));
};
var randomBoolean = (probability = 0.5) => {
  return Math.random() < probability;
};
var randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
var randomShuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// src/utils/time.ts
var formatDate = (date) => {
  return date.toISOString().split("T")[0];
};
var formatTime = (date) => {
  return date.toISOString().split("T")[1].split(".")[0];
};
var formatDateTime = (date) => {
  return date.toISOString().replace("T", " ").split(".")[0];
};
var addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 6e4);
};
var addHours = (date, hours) => {
  return new Date(date.getTime() + hours * 36e5);
};
var addDays = (date, days) => {
  return new Date(date.getTime() + days * 864e5);
};
var isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
var isWorkday = (date) => {
  return !isWeekend(date);
};

// src/utils/export.ts
var import_exceljs = __toESM(require("exceljs"));
var import_file_saver = require("file-saver");
init_accountStore();
var exportToCSV = async (data, filename) => {
  const workbook = new import_exceljs.default.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    data.forEach((item) => {
      const row = headers.map((header) => item[header]);
      worksheet.addRow(row);
    });
  }
  const buffer = await workbook.xlsx.writeBuffer();
  const dataBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  (0, import_file_saver.saveAs)(dataBlob, `${filename}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
};
var exportFundContracts = () => {
  const { contracts } = useSimulationStore.getState();
  exportToCSV(contracts, "fund_contracts");
};
var exportTrades = () => {
  const { accounts } = useAccountStore.getState();
  if (accounts.length > 0 && accounts[0].trades) {
    exportToCSV(accounts[0].trades, "trades");
  }
};

// src/index.ts
init_websocket();

// src/utils/dataMasking.ts
var maskUserId = (userId) => {
  if (!userId || userId.length <= 4) {
    return "****";
  }
  return userId.substring(0, 2) + "****" + userId.substring(userId.length - 2);
};
var maskUsername = (username) => {
  if (!username) {
    return "***";
  }
  if (username.length === 1) {
    return "*";
  }
  if (username.length === 2) {
    return username.charAt(0) + "*";
  }
  return username.charAt(0) + "**" + username.charAt(username.length - 1);
};
var maskBalance = (balance, precision = 2) => {
  if (balance < 100) {
    return balance.toFixed(precision);
  }
  const balanceStr = Math.floor(balance).toString();
  if (balanceStr.length <= 2) {
    return balance.toFixed(precision);
  }
  return balanceStr.substring(0, 2) + "*".repeat(balanceStr.length - 2) + "." + "*".repeat(precision);
};
var maskAmount = (amount) => {
  if (amount < 10) {
    return amount.toFixed(2);
  }
  const amountStr = Math.floor(amount).toString();
  if (amountStr.length <= 1) {
    return amount.toFixed(2);
  }
  return amountStr.charAt(0) + "*".repeat(amountStr.length - 1) + ".**";
};
var maskContractId = (contractId) => {
  if (!contractId || contractId.length <= 6) {
    return "******";
  }
  return contractId.substring(0, 3) + "***" + contractId.substring(contractId.length - 3);
};
var maskTrades = (trades) => {
  return trades.map((trade) => ({
    ...trade,
    trade_id: trade.trade_id ? maskContractId(trade.trade_id) : "***",
    amount: trade.amount ? maskAmount(trade.amount) : "0.00",
    price: trade.price ? maskAmount(trade.price) : "0.00",
    profit: trade.profit ? maskAmount(Math.abs(trade.profit)) : "0.00"
  }));
};
var maskAccount = (account) => {
  if (!account)
    return null;
  return {
    ...account,
    user_id: maskUserId(account.user_id),
    username: maskUsername(account.username),
    balance: maskBalance(account.balance),
    equity: maskBalance(account.equity),
    trades: maskTrades(account.trades || [])
  };
};
var maskContract = (contract) => {
  if (!contract)
    return null;
  return {
    ...contract,
    contract_id: maskContractId(contract.contract_id),
    cost: maskAmount(contract.cost),
    profit: contract.profit ? maskAmount(Math.abs(contract.profit)) : "0.00",
    strike_price: maskAmount(contract.strike_price)
  };
};
var maskContracts = (contracts) => {
  return contracts.map((contract) => maskContract(contract));
};
var maskIndex = (index) => {
  if (!index)
    return null;
  return {
    ...index,
    current_price: index.current_price,
    last_updated: index.last_updated,
    northbound_flow: index.northbound_flow ? maskAmount(index.northbound_flow) : "0.00",
    southbound_flow: index.southbound_flow ? maskAmount(index.southbound_flow) : "0.00"
  };
};
var enableDataMasking = (enable = true) => {
  if (typeof window !== "undefined") {
    window.dataMaskingEnabled = enable;
  }
};
var isDataMaskingEnabled = () => {
  if (typeof window !== "undefined") {
    return !!window.dataMaskingEnabled;
  }
  return false;
};

// src/index.ts
init_supabase();
var initSimulation = (opts) => {
  const scheduler = new Scheduler(opts?.startAt, { speed: opts?.speed || 60 });
  const engines = [
    new IpoEngine(),
    new SeatEngine(),
    new BlockEngine(),
    new FundEngine(),
    new FundContractEngine()
  ];
  if (opts?.enableFutures !== false)
    engines.push(new FuturesArbEngine());
  if (opts?.enableETF !== false)
    engines.push(new ETFCreationEngine());
  if (opts?.enableOptions !== false)
    engines.push(new OptionsEngine());
  if (opts?.enableSupabase) {
    const { initSupabase: initSupabase2 } = (init_supabase(), __toCommonJS(supabase_exports));
    initSupabase2();
  }
  if (opts?.enableWebSocket) {
    const { initWebSocket: initWebSocket2 } = (init_websocket(), __toCommonJS(websocket_exports));
    initWebSocket2();
  }
  if (opts?.demoAccount) {
    const { initDemoAccount } = (init_accountStore(), __toCommonJS(accountStore_exports));
    initDemoAccount();
  }
  scheduler.start();
  return scheduler;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockEngine,
  ETFCreationEngine,
  FundContractEngine,
  FundEngine,
  FuturesArbEngine,
  IpoEngine,
  OptionsEngine,
  Scheduler,
  SeatEngine,
  addDays,
  addHours,
  addMinutes,
  bus,
  disconnectWebSocket,
  enableDataMasking,
  eventBus,
  exportFundContracts,
  exportToCSV,
  exportTrades,
  formatDate,
  formatDateTime,
  formatTime,
  getSocket,
  initSimulation,
  initSupabase,
  initWebSocket,
  isDataMaskingEnabled,
  isWeekend,
  isWorkday,
  maskAccount,
  maskAmount,
  maskBalance,
  maskContract,
  maskContractId,
  maskContracts,
  maskIndex,
  maskTrades,
  maskUserId,
  maskUsername,
  notify,
  randomBoolean,
  randomChoice,
  randomFloat,
  randomInt,
  randomShuffle,
  requestNotificationPermission,
  supabase,
  useAccountStore,
  useSimulationStore
});
