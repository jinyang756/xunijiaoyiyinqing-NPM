import {
  __esm
} from "./chunk-3ROPP2TA.mjs";

// src/utils/validation.ts
var isValidUserId, isValidContractId, isValidContractResult, isValidAmount, isValidUsername, sanitizeString, validateAndSanitizeTrade, validateAccountUpdates, validation_default;
var init_validation = __esm({
  "src/utils/validation.ts"() {
    isValidUserId = (userId) => {
      if (!userId || typeof userId !== "string") {
        return false;
      }
      return userId.length > 0 && userId.length <= 50;
    };
    isValidContractId = (contractId) => {
      if (!contractId || typeof contractId !== "string") {
        return false;
      }
      return contractId.length > 0 && contractId.length <= 100;
    };
    isValidContractResult = (result) => {
      return result === "win" || result === "loss";
    };
    isValidAmount = (amount) => {
      if (typeof amount !== "number" || isNaN(amount)) {
        return false;
      }
      return amount >= 0 && amount <= 1e7;
    };
    isValidUsername = (username) => {
      if (!username || typeof username !== "string") {
        return false;
      }
      return username.length > 0 && username.length <= 30;
    };
    sanitizeString = (input) => {
      if (!input || typeof input !== "string") {
        return "";
      }
      return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
    };
    validateAndSanitizeTrade = (trade) => {
      if (!trade || typeof trade !== "object") {
        return null;
      }
      const sanitizedTrade = {};
      for (const [key, value] of Object.entries(trade)) {
        if (typeof value === "string") {
          sanitizedTrade[key] = sanitizeString(value);
        } else if (typeof value === "number") {
          if (!isNaN(value) && isFinite(value)) {
            sanitizedTrade[key] = value;
          }
        } else if (typeof value === "boolean") {
          sanitizedTrade[key] = value;
        } else if (value === null || value === void 0) {
          sanitizedTrade[key] = value;
        }
      }
      return sanitizedTrade;
    };
    validateAccountUpdates = (updates) => {
      if (!updates || typeof updates !== "object") {
        return null;
      }
      const validatedUpdates = {};
      for (const [key, value] of Object.entries(updates)) {
        switch (key) {
          case "username":
            if (typeof value === "string" && isValidUsername(value)) {
              validatedUpdates[key] = sanitizeString(value);
            }
            break;
          case "balance":
          case "equity":
          case "pnl":
            if (typeof value === "number" && isValidAmount(value)) {
              validatedUpdates[key] = value;
            }
            break;
          case "positions":
          case "trades":
            if (Array.isArray(value)) {
              validatedUpdates[key] = value;
            }
            break;
          default:
            break;
        }
      }
      return Object.keys(validatedUpdates).length > 0 ? validatedUpdates : null;
    };
    validation_default = {
      isValidUserId,
      isValidContractId,
      isValidContractResult,
      isValidAmount,
      isValidUsername,
      sanitizeString,
      validateAndSanitizeTrade,
      validateAccountUpdates
    };
  }
});

export {
  isValidUserId,
  isValidContractId,
  isValidContractResult,
  isValidAmount,
  isValidUsername,
  sanitizeString,
  validateAndSanitizeTrade,
  validateAccountUpdates,
  validation_default,
  init_validation
};
