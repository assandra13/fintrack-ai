import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, format } from "date-fns";

// Calculate total income for a period
export const calculateTotalIncome = (transactions, startDate, endDate) => {
  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === "income" && date >= startDate && date <= endDate;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total expense for a period
export const calculateTotalExpense = (transactions, startDate, endDate) => {
  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === "expense" && date >= startDate && date <= endDate;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate balance (income - expense)
export const calculateBalance = (transactions, startDate, endDate) => {
  const income = calculateTotalIncome(transactions, startDate, endDate);
  const expense = calculateTotalExpense(transactions, startDate, endDate);
  return income - expense;
};

// Calculate total balance across all wallets
export const calculateTotalWalletBalance = (wallets) => {
  return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
};

// Calculate budget progress
export const calculateBudgetProgress = (budget, transactions, selectedMonth = null) => {
  let monthStart, monthEnd;

  if (selectedMonth) {
    // Parse YYYY-MM format
    const [year, month] = selectedMonth.split("-").map(Number);
    monthStart = new Date(year, month - 1, 1);
    monthEnd = new Date(year, month, 0);
  } else {
    // Use current month
    const now = new Date();
    monthStart = startOfMonth(now);
    monthEnd = endOfMonth(now);
  }

  const spent = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === "expense" && t.categoryId === budget.categoryId && date >= monthStart && date <= monthEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - spent;

  return {
    spent,
    remaining,
    percentage: Math.min(percentage, 100),
    isOverBudget: spent > budget.amount,
  };
};

// Calculate goal progress
export const calculateGoalProgress = (goal) => {
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  // Calculate days remaining
  const now = new Date();
  const deadline = new Date(goal.deadline);
  const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  return {
    percentage: Math.min(percentage, 100),
    remaining,
    isCompleted,
    daysRemaining,
  };
};

// Calculate expense by category
export const calculateExpenseByCategory = (transactions, startDate, endDate) => {
  const expenses = transactions.filter((t) => {
    const date = new Date(t.date);
    return t.type === "expense" && date >= startDate && date <= endDate;
  });

  const byCategory = {};
  expenses.forEach((t) => {
    if (!byCategory[t.categoryId]) {
      byCategory[t.categoryId] = {
        categoryId: t.categoryId,
        categoryName: t.categoryName,
        total: 0,
        count: 0,
      };
    }
    byCategory[t.categoryId].total += t.amount;
    byCategory[t.categoryId].count += 1;
  });

  return Object.values(byCategory).sort((a, b) => b.total - a.total);
};

// Generate insights from transactions
export const generateInsights = (transactions, previousTransactions) => {
  const insights = [];

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  // Current month stats
  const currentIncome = calculateTotalIncome(transactions, monthStart, monthEnd);
  const currentExpense = calculateTotalExpense(transactions, monthStart, monthEnd);

  // Previous month stats
  const prevIncome = calculateTotalIncome(previousTransactions, prevMonthStart, prevMonthEnd);
  const prevExpense = calculateTotalExpense(previousTransactions, prevMonthStart, prevMonthEnd);

  // Income comparison
  if (prevIncome > 0) {
    const incomeChange = ((currentIncome - prevIncome) / prevIncome) * 100;
    if (Math.abs(incomeChange) > 10) {
      insights.push({
        type: incomeChange > 0 ? "success" : "warning",
        message: `Pemasukan ${incomeChange > 0 ? "naik" : "turun"} ${Math.abs(incomeChange).toFixed(1)}% dari bulan lalu`,
      });
    }
  }

  // Expense comparison
  if (prevExpense > 0) {
    const expenseChange = ((currentExpense - prevExpense) / prevExpense) * 100;
    if (Math.abs(expenseChange) > 10) {
      insights.push({
        type: expenseChange > 0 ? "warning" : "success",
        message: `Pengeluaran ${expenseChange > 0 ? "naik" : "turun"} ${Math.abs(expenseChange).toFixed(1)}% dari bulan lalu`,
      });
    }
  }

  // Category insights
  const categoryExpenses = calculateExpenseByCategory(transactions, monthStart, monthEnd);
  const prevCategoryExpenses = calculateExpenseByCategory(previousTransactions, prevMonthStart, prevMonthEnd);

  categoryExpenses.forEach((current) => {
    const prev = prevCategoryExpenses.find((p) => p.categoryId === current.categoryId);
    if (prev && prev.total > 0) {
      const change = ((current.total - prev.total) / prev.total) * 100;
      if (change > 20) {
        insights.push({
          type: "info",
          message: `Pengeluaran ${current.categoryName} naik ${change.toFixed(1)}% dari bulan lalu`,
        });
      }
    }
  });

  // Top spending category
  if (categoryExpenses.length > 0) {
    const top = categoryExpenses[0];
    const percentage = currentExpense > 0 ? (top.total / currentExpense) * 100 : 0;
    if (percentage > 30) {
      insights.push({
        type: "info",
        message: `${top.categoryName} adalah kategori pengeluaran terbesar (${percentage.toFixed(1)}%)`,
      });
    }
  }

  return insights;
};

// Calculate trend data for chart
export const calculateTrendData = (transactions, days = 30) => {
  const now = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const income = calculateTotalIncome(transactions, date, nextDate);
    const expense = calculateTotalExpense(transactions, date, nextDate);

    data.push({
      date: format(date, "dd MMM"),
      income,
      expense,
      balance: income - expense,
    });
  }

  return data;
};
