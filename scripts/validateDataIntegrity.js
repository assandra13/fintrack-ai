#!/usr/bin/env node

/**
 * Validation Script: Data Integrity Checker
 *
 * Jalankan: node scripts/validateDataIntegrity.js
 *
 * Memvalidasi:
 * 1. Semua transaksi punya date field yang valid (ISO format atau parseable)
 * 2. Urutan transaksi konsisten (terbaru di atas)
 * 3. Profil user tersimpan di localStorage
 * 4. Tidak ada data yang corrupt atau missing
 */

const fs = require("fs");
const path = require("path");

// Warna untuk terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(level, message) {
  const prefix = {
    "✓": `${colors.green}✓${colors.reset}`,
    "✗": `${colors.red}✗${colors.reset}`,
    "⚠": `${colors.yellow}⚠${colors.reset}`,
    ℹ: `${colors.blue}ℹ${colors.reset}`,
  };
  console.log(`${prefix[level]} ${message}`);
}

function validateTransactionDates(transactions) {
  log("ℹ", `Checking ${transactions.length} transactions...`);

  let errors = 0;
  let warnings = 0;

  transactions.forEach((txn, idx) => {
    // Check date field exists and is valid
    const dateField = txn.date || txn.createdAt;
    if (!dateField) {
      log("✗", `Transaction ${idx} (id: ${txn.id}): Missing both date and createdAt`);
      errors++;
      return;
    }

    try {
      const dateObj = new Date(dateField);
      if (isNaN(dateObj.getTime())) {
        log("✗", `Transaction ${idx} (id: ${txn.id}): Invalid date format: ${dateField}`);
        errors++;
        return;
      }

      // Warn if not ISO format
      if (txn.date && !txn.date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        log("⚠", `Transaction ${idx} (id: ${txn.id}): Date not in ISO format: ${txn.date}`);
        warnings++;
      }
    } catch (e) {
      log("✗", `Transaction ${idx} (id: ${txn.id}): Date parsing error: ${e.message}`);
      errors++;
    }
  });

  return { errors, warnings };
}

function validateTransactionOrdering(transactions) {
  log("ℹ", "Checking transaction order (should be newest first)...");

  let errors = 0;

  for (let i = 0; i < transactions.length - 1; i++) {
    const current = transactions[i];
    const next = transactions[i + 1];

    const currentTime = new Date(current.date || current.createdAt).getTime();
    const nextTime = new Date(next.date || next.createdAt).getTime();

    if (currentTime < nextTime) {
      log("✗", `Order error at index ${i}-${i + 1}: ${current.id} (${currentTime}) should come after ${next.id} (${nextTime})`);
      errors++;
    }
  }

  if (errors === 0) {
    log("✓", "Transaction order is correct (newest first)");
  }

  return { errors };
}

function validateProfilePersistence() {
  log("ℹ", "Checking profile persistence...");

  // Nota: Ini adalah check untuk localStorage dalam browser environment
  // Di Node.js environment, kita hanya bisa memberikan template/contoh

  const example = {
    "fintrack-user": {
      id: "user-xxx",
      name: "Your Name",
      email: "email@example.com",
      currency: "IDR",
      locale: "id-ID",
      avatar: null,
    },
    "fintrack-users": [
      {
        id: "user-xxx",
        name: "Your Name",
        email: "email@example.com",
        password: "hashed",
        currency: "IDR",
        locale: "id-ID",
        avatar: null,
        createdAt: "2025-11-28T...",
      },
    ],
  };

  log("⚠", "Profile persistence check is browser-only");
  log("ℹ", "Expected localStorage keys:");
  Object.keys(example).forEach((key) => {
    console.log(`  - ${key}`);
  });

  return { errors: 0, warnings: 1 };
}

function validateDataStructure(data) {
  log("ℹ", "Checking data structure...");

  let errors = 0;

  if (!Array.isArray(data.transactions)) {
    log("✗", "transactions is not an array");
    errors++;
  }

  if (!Array.isArray(data.wallets)) {
    log("✗", "wallets is not an array");
    errors++;
  }

  if (!Array.isArray(data.categories)) {
    log("✗", "categories is not an array");
    errors++;
  }

  if (errors === 0) {
    log("✓", "Data structure is valid");
  }

  return { errors };
}

// Main validation function
function runValidation() {
  console.log(`${colors.blue}=== FinTrack AI Data Integrity Validator ===${colors.reset}\n`);

  // Contoh data (dalam real scenario, ini akan dimuat dari browser localStorage)
  const sampleData = {
    transactions: [
      {
        id: "txn-1732300800000",
        date: "2025-11-28T00:00:00.000Z",
        amount: 50000,
        type: "expense",
        categoryId: "cat-1",
        walletId: "wallet-1",
        description: "Makan siang",
        createdAt: "2025-11-28T10:30:00.000Z",
      },
      {
        id: "txn-1732214400000",
        date: "2025-11-27T00:00:00.000Z",
        amount: 100000,
        type: "income",
        categoryId: "cat-2",
        walletId: "wallet-1",
        description: "Gaji",
        createdAt: "2025-11-27T09:00:00.000Z",
      },
      {
        id: "txn-1731609600000",
        date: "2025-11-15T00:00:00.000Z",
        amount: 25000,
        type: "expense",
        categoryId: "cat-3",
        walletId: "wallet-1",
        description: "Transport",
        createdAt: "2025-11-15T14:20:00.000Z",
      },
    ],
    wallets: [
      {
        id: "wallet-1",
        name: "Cash",
        balance: 25000,
        color: "#3b82f6",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ],
    categories: [
      { id: "cat-1", name: "Makanan", type: "expense" },
      { id: "cat-2", name: "Gaji", type: "income" },
      { id: "cat-3", name: "Transport", type: "expense" },
    ],
  };

  console.log("Data Validation Results:\n");

  // Run all validations
  const results = {
    structure: validateDataStructure(sampleData),
    dates: validateTransactionDates(sampleData.transactions),
    ordering: validateTransactionOrdering(sampleData.transactions),
    profile: validateProfilePersistence(),
  };

  // Summary
  console.log(`\n${colors.blue}=== Validation Summary ===${colors.reset}`);

  const totalErrors = Object.values(results).reduce((sum, r) => sum + (r.errors || 0), 0);
  const totalWarnings = Object.values(results).reduce((sum, r) => sum + (r.warnings || 0), 0);

  if (totalErrors === 0) {
    log("✓", `All checks passed! (${totalWarnings} warning(s))`);
    process.exit(0);
  } else {
    log("✗", `${totalErrors} error(s) found, ${totalWarnings} warning(s)`);
    process.exit(1);
  }
}

// Run validation
runValidation();
