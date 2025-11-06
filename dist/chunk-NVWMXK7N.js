"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/supabase.ts
var supabase_exports = {};
__export(supabase_exports, {
  getSupabaseClient: () => getSupabaseClient,
  initSupabase: () => initSupabase,
  supabase: () => supabase
});
var _supabasejs = require('@supabase/supabase-js');
var supabaseClient, getSupabaseConfig, validateSupabaseConfig, getSupabaseClient, supabase, initSupabase, createTables;
var init_supabase = __esm({
  "src/services/supabase.ts"() {
    supabaseClient = null;
    getSupabaseConfig = () => {
      const SUPABASE_URL = typeof process !== "undefined" && _optionalChain([process, 'access', _ => _.env, 'optionalAccess', _2 => _2.VITE_SUPABASE_URL]) || "";
      const SUPABASE_KEY = typeof process !== "undefined" && _optionalChain([process, 'access', _3 => _3.env, 'optionalAccess', _4 => _4.VITE_SUPABASE_ANON_KEY]) || "";
      return { SUPABASE_URL, SUPABASE_KEY };
    };
    validateSupabaseConfig = (url, key) => {
      if (!url || url === "") {
        console.warn("\u26A0\uFE0F  Supabase URL \u672A\u914D\u7F6E\uFF0C\u8BF7\u8BBE\u7F6E VITE_SUPABASE_URL \u73AF\u5883\u53D8\u91CF");
        return false;
      }
      if (!key || key === "") {
        console.warn("\u26A0\uFE0F  Supabase Key \u672A\u914D\u7F6E\uFF0C\u8BF7\u8BBE\u7F6E VITE_SUPABASE_ANON_KEY \u73AF\u5883\u53D8\u91CF");
        return false;
      }
      try {
        new URL(url);
      } catch (e) {
        console.warn("\u26A0\uFE0F  Supabase URL \u683C\u5F0F\u4E0D\u6B63\u786E");
        return false;
      }
      return true;
    };
    getSupabaseClient = exports.getSupabaseClient = () => {
      if (supabaseClient) {
        return supabaseClient;
      }
      const { SUPABASE_URL, SUPABASE_KEY } = getSupabaseConfig();
      if (!validateSupabaseConfig(SUPABASE_URL, SUPABASE_KEY)) {
        return null;
      }
      try {
        supabaseClient = _supabasejs.createClient.call(void 0, SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          },
          db: {
            schema: "public"
          }
        });
        return supabaseClient;
      } catch (error) {
        console.error("\u274C Supabase \u5BA2\u6237\u7AEF\u521D\u59CB\u5316\u5931\u8D25:", error);
        return null;
      }
    };
    supabase = exports.supabase = getSupabaseClient();
    initSupabase = exports.initSupabase = async () => {
      const client = getSupabaseClient();
      if (!client) {
        console.error("\u274C Supabase \u5BA2\u6237\u7AEF\u672A\u6B63\u786E\u914D\u7F6E\uFF0C\u65E0\u6CD5\u521D\u59CB\u5316");
        return false;
      }
      try {
        const { data, error } = await client.from("fund_contracts").select("count").limit(1);
        if (error) {
          console.warn("\u26A0\uFE0F  Supabase \u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25:", error.message);
        } else {
          console.log("\u2705 Supabase \u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F");
        }
      } catch (error) {
        console.warn("\u26A0\uFE0F  Supabase \u8FDE\u63A5\u6D4B\u8BD5\u5F02\u5E38:", error);
      }
      await createTables();
      console.log("\u2705 Supabase initialized");
      return true;
    };
    createTables = async () => {
      const client = getSupabaseClient();
      if (!client)
        return;
      try {
        await client.rpc("create_fund_contracts_table");
      } catch (error) {
        console.log("Fund contracts table may already exist");
      }
      try {
        await client.rpc("create_trades_table");
      } catch (error) {
        console.log("Trades table may already exist");
      }
      try {
        await client.rpc("create_accounts_table");
      } catch (error) {
        console.log("Accounts table may already exist");
      }
    };
  }
});










exports.__esm = __esm; exports.__export = __export; exports.__toCommonJS = __toCommonJS; exports.getSupabaseClient = getSupabaseClient; exports.supabase = supabase; exports.initSupabase = initSupabase; exports.supabase_exports = supabase_exports; exports.init_supabase = init_supabase;
