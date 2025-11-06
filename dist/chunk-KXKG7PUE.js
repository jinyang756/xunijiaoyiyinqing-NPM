"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkJXD34ORVjs = require('./chunk-JXD34ORV.js');

// src/utils/validation.ts
var isValidUserId, isValidContractId, isValidContractResult, isValidAmount, isValidUsername, sanitizeString, validateAndSanitizeTrade, validateAccountUpdates, validation_default;
var init_validation = _chunkJXD34ORVjs.__esm.call(void 0, {
  "src/utils/validation.ts"() {
    isValidUserId = exports.isValidUserId = (userId) => {
      if (!userId || typeof userId !== "string") {
        return false;
      }
      return userId.length > 0 && userId.length <= 50;
    };
    isValidContractId = exports.isValidContractId = (contractId) => {
      if (!contractId || typeof contractId !== "string") {
        return false;
      }
      return contractId.length > 0 && contractId.length <= 100;
    };
    isValidContractResult = exports.isValidContractResult = (result) => {
      return result === "win" || result === "loss";
    };
    isValidAmount = exports.isValidAmount = (amount) => {
      if (typeof amount !== "number" || isNaN(amount)) {
        return false;
      }
      return amount >= 0 && amount <= 1e7;
    };
    isValidUsername = exports.isValidUsername = (username) => {
      if (!username || typeof username !== "string") {
        return false;
      }
      return username.length > 0 && username.length <= 30;
    };
    sanitizeString = exports.sanitizeString = (input) => {
      if (!input || typeof input !== "string") {
        return "";
      }
      return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
    };
    validateAndSanitizeTrade = exports.validateAndSanitizeTrade = (trade) => {
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
    validateAccountUpdates = exports.validateAccountUpdates = (updates) => {
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
    validation_default = exports.validation_default = {
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












exports.isValidUserId = isValidUserId; exports.isValidContractId = isValidContractId; exports.isValidContractResult = isValidContractResult; exports.isValidAmount = isValidAmount; exports.isValidUsername = isValidUsername; exports.sanitizeString = sanitizeString; exports.validateAndSanitizeTrade = validateAndSanitizeTrade; exports.validateAccountUpdates = validateAccountUpdates; exports.validation_default = validation_default; exports.init_validation = init_validation;
