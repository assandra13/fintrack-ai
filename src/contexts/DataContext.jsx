import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultCategories } from "../data/defaultCategories";
import { syncToCloud, subscribeToCloudChanges, loadFromCloud } from "../lib/supabaseSync";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

// Generate user-specific storage keys to prevent data leakage between users
const getStorageKeys = (userId) => {
  if (!userId) {
    return {
      TRANSACTIONS: "fintrack-transactions",
      WALLETS: "fintrack-wallets",
      CATEGORIES: "fintrack-categories",
      BUDGETS: "fintrack-budgets",
      GOALS: "fintrack-goals",
      BILLS: "fintrack-bills",
    };
  }

  return {
    TRANSACTIONS: `fintrack-${userId}-transactions`,
    WALLETS: `fintrack-${userId}-wallets`,
    CATEGORIES: `fintrack-${userId}-categories`,
    BUDGETS: `fintrack-${userId}-budgets`,
    GOALS: `fintrack-${userId}-goals`,
    BILLS: `fintrack-${userId}-bills`,
  };
};

const clearAllLocalStorage = () => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('fintrack-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      console.log("✓ No user - clearing all data");
      setTransactions([]);
      setWallets([]);
      setCategories([]);
      setBudgets([]);
      setGoals([]);
      setBills([]);
      setCloudSyncEnabled(false);
      setLoading(false);
      return;
    }

    console.log("✓ User authenticated:", user.id);
    setCloudSyncEnabled(true);
    setLoading(true);

    const STORAGE_KEYS = getStorageKeys(user.id);

    const loadCloudData = async () => {
      const cloudData = await loadFromCloud(user.id);

      if (cloudData && cloudData.length > 0) {
        console.log("✓ Loaded data from cloud");
        const dataMap = {};
        cloudData.forEach((item) => {
          dataMap[item.data_type] = item.data;
        });

        setTransactions(dataMap.transactions || []);
        setWallets(dataMap.wallets || []);
        setCategories(dataMap.categories || defaultCategories);
        setBudgets(dataMap.budgets || []);
        setGoals(dataMap.goals || []);
        setBills(dataMap.bills || []);

        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(dataMap.transactions || []));
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(dataMap.wallets || []));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(dataMap.categories || defaultCategories));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(dataMap.budgets || []));
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(dataMap.goals || []));
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(dataMap.bills || []));
      } else {
        console.log("✓ New user - initializing");
        const defaultWallet = {
          id: `wallet-${user.id}-${Date.now()}`,
          name: "Cash",
          balance: 0,
          icon: "Wallet",
          color: "#3b82f6",
          createdAt: new Date().toISOString(),
        };

        setTransactions([]);
        setWallets([defaultWallet]);
        setCategories(defaultCategories);
        setBudgets([]);
        setGoals([]);
        setBills([]);

        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify([defaultWallet]));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify([]));

        await syncToCloud(user.id, "wallets", [defaultWallet]);
        await syncToCloud(user.id, "categories", defaultCategories);
      }

      setLoading(false);
    };

    loadCloudData();

    const subscription = subscribeToCloudChanges(user.id, (newData) => {
      console.log("✓ Real-time update:", newData.data_type);

      if (newData.data_type === "transactions") {
        setTransactions(newData.data);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newData.data));
      } else if (newData.data_type === "wallets") {
        setWallets(newData.data);
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(newData.data));
      } else if (newData.data_type === "categories") {
        setCategories(newData.data);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newData.data));
      } else if (newData.data_type === "budgets") {
        setBudgets(newData.data);
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(newData.data));
      } else if (newData.data_type === "goals") {
        setGoals(newData.data);
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(newData.data));
      } else if (newData.data_type === "bills") {
        setBills(newData.data);
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(newData.data));
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user?.id]);

  const addTransaction = (transaction) => {
    if (!user?.id) return null;
    const STORAGE_KEYS = getStorageKeys(user.id);

    const newTransaction = {
      ...transaction,
      id: `txn-${user.id}-${Date.now()}`,
      date: transaction.date ? new Date(transaction.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const wallet = wallets.find((w) => w.id === transaction.walletId);
    if (wallet) {
      const updatedWallets = wallets.map((w) => {
        if (w.id === transaction.walletId) {
          return {
            ...w,
            balance: transaction.type === "income" ? w.balance + transaction.amount : w.balance - transaction.amount,
          };
        }
        return w;
      });
      setWallets(updatedWallets);
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
      syncToCloud(user.id, "wallets", updatedWallets);
    }

    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    syncToCloud(user.id, "transactions", updated);

    return newTransaction;
  };

  const updateTransaction = (id, updates) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const oldTransaction = transactions.find((t) => t.id === id);
    if (!oldTransaction) return;

    const wallet = wallets.find((w) => w.id === oldTransaction.walletId);
    if (wallet) {
      let updatedWallets = wallets.map((w) => {
        if (w.id === oldTransaction.walletId) {
          return {
            ...w,
            balance: oldTransaction.type === "income" ? w.balance - oldTransaction.amount : w.balance + oldTransaction.amount,
          };
        }
        return w;
      });

      const newWalletId = updates.walletId || oldTransaction.walletId;
      const newType = updates.type || oldTransaction.type;
      const newAmount = updates.amount || oldTransaction.amount;

      updatedWallets = updatedWallets.map((w) => {
        if (w.id === newWalletId) {
          return {
            ...w,
            balance: newType === "income" ? w.balance + newAmount : w.balance - newAmount,
          };
        }
        return w;
      });

      setWallets(updatedWallets);
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
      syncToCloud(user.id, "wallets", updatedWallets);
    }

    const updated = transactions.map((t) =>
      t.id === id
        ? {
          ...t,
          ...updates,
          date: updates.date ? new Date(updates.date).toISOString() : t.date || t.createdAt,
          updatedAt: new Date().toISOString(),
        }
        : t
    );
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    syncToCloud(user.id, "transactions", updated);
  };

  const deleteTransaction = (id) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    const updatedWallets = wallets.map((w) => {
      if (w.id === transaction.walletId) {
        return {
          ...w,
          balance: transaction.type === "income" ? w.balance - transaction.amount : w.balance + transaction.amount,
        };
      }
      return w;
    });
    setWallets(updatedWallets);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
    syncToCloud(user.id, "wallets", updatedWallets);

    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    syncToCloud(user.id, "transactions", updated);
  };

  const addWallet = (wallet) => {
    if (!user?.id) return null;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const newWallet = {
      ...wallet,
      id: `wallet-${user.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...wallets, newWallet];
    setWallets(updated);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updated));
    syncToCloud(user.id, "wallets", updated);
    return newWallet;
  };

  const updateWallet = (id, updates) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = wallets.map((w) => (w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w));
    setWallets(updated);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updated));
    syncToCloud(user.id, "wallets", updated);
  };

  const deleteWallet = (id) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = wallets.filter((w) => w.id !== id);
    setWallets(updated);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updated));
    syncToCloud(user.id, "wallets", updated);
  };

  const transferBetweenWallets = (fromWalletId, toWalletId, amount) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = wallets.map((w) => {
      if (w.id === fromWalletId) return { ...w, balance: w.balance - amount };
      if (w.id === toWalletId) return { ...w, balance: w.balance + amount };
      return w;
    });
    setWallets(updated);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updated));
    syncToCloud(user.id, "wallets", updated);

    const transferTxn = {
      id: `txn-${user.id}-${Date.now()}`,
      type: "transfer",
      amount,
      fromWalletId,
      toWalletId,
      date: new Date().toISOString(),
      description: "Transfer antar wallet",
      createdAt: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, transferTxn];
    setTransactions(updatedTransactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
    syncToCloud(user.id, "transactions", updatedTransactions);
  };

  const addCategory = (category) => {
    if (!user?.id) return null;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const newCategory = {
      ...category,
      id: `cat-${user.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    syncToCloud(user.id, "categories", updated);
    return newCategory;
  };

  const updateCategory = (id, updates) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    syncToCloud(user.id, "categories", updated);
  };

  const deleteCategory = (id) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    syncToCloud(user.id, "categories", updated);
  };

  const addBudget = (budget) => {
    if (!user?.id) return null;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const newBudget = {
      ...budget,
      id: `budget-${user.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...budgets, newBudget];
    setBudgets(updated);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
    syncToCloud(user.id, "budgets", updated);
    return newBudget;
  };

  const updateBudget = (id, updates) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = budgets.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b));
    setBudgets(updated);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
    syncToCloud(user.id, "budgets", updated);
  };

  const deleteBudget = (id) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = budgets.filter((b) => b.id !== id);
    setBudgets(updated);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
    syncToCloud(user.id, "budgets", updated);
  };

  const addGoal = (goal) => {
    if (!user?.id) return null;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const newGoal = {
      ...goal,
      id: `goal-${user.id}-${Date.now()}`,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    syncToCloud(user.id, "goals", updated);
    return newGoal;
  };

  const updateGoal = (id, updates) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = goals.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g));
    setGoals(updated);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    syncToCloud(user.id, "goals", updated);
  };

  const deleteGoal = (id) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    syncToCloud(user.id, "goals", updated);
  };

  const allocateToGoal = (goalId, amount) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = goals.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
    setGoals(updated);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    syncToCloud(user.id, "goals", updated);
  };

  const addBill = (bill) => {
    if (!user?.id) return null;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const newBill = {
      ...bill,
      id: `bill-${user.id}-${Date.now()}`,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...bills, newBill];
    setBills(updated);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(updated));
    syncToCloud(user.id, "bills", updated);
    return newBill;
  };

  const updateBill = (id, updates) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = bills.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b));
    setBills(updated);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(updated));
    syncToCloud(user.id, "bills", updated);
  };

  const deleteBill = (id) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);
    const updated = bills.filter((b) => b.id !== id);
    setBills(updated);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(updated));
    syncToCloud(user.id, "bills", updated);
  };

  const markBillAsPaid = (id, walletId) => {
    if (!user?.id) return;
    const STORAGE_KEYS = getStorageKeys(user.id);

    // Find the bill
    const bill = bills.find((b) => b.id === id);
    if (!bill) return;

    // Create expense transaction
    if (walletId) {
      const newTransaction = {
        type: "expense",
        amount: bill.amount,
        categoryId: bill.categoryId,
        walletId: walletId,
        date: new Date().toISOString(),
        description: `Pembayaran ${bill.name}`,
        createdAt: new Date().toISOString(),
        id: `txn-${user.id}-${Date.now()}`,
      };

      // Update wallet balance
      const updatedWallets = wallets.map((w) => {
        if (w.id === walletId) {
          return {
            ...w,
            balance: w.balance - bill.amount,
          };
        }
        return w;
      });
      setWallets(updatedWallets);
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
      syncToCloud(user.id, "wallets", updatedWallets);

      // Add transaction
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
      syncToCloud(user.id, "transactions", updatedTransactions);
    }

    // Mark bill as paid
    const updated = bills.map((b) => (b.id === id ? { ...b, isPaid: true, paidAt: new Date().toISOString(), paidWithWalletId: walletId } : b));
    setBills(updated);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(updated));
    syncToCloud(user.id, "bills", updated);
  };

  const clearAllData = () => {
    setTransactions([]);
    setWallets([]);
    setCategories(defaultCategories);
    setBudgets([]);
    setGoals([]);
    setBills([]);
    clearAllLocalStorage();
  };

  const value = {
    transactions,
    wallets,
    categories,
    budgets,
    goals,
    bills,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addWallet,
    updateWallet,
    deleteWallet,
    transferBetweenWallets,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    allocateToGoal,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    clearAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
