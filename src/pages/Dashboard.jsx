import React, { useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency } from "../utils/formatters";
import { calculateTotalIncome, calculateTotalExpense, calculateTotalWalletBalance, calculateExpenseByCategory } from "../utils/calculations";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import Card from "../components/common/Card";
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, wallets, budgets, bills } = useData();

  // Calculate current month stats
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const income = calculateTotalIncome(transactions, monthStart, monthEnd);
    const expense = calculateTotalExpense(transactions, monthStart, monthEnd);
    const balance = income - expense;

    // Previous month for comparison
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));
    const prevIncome = calculateTotalIncome(transactions, prevMonthStart, prevMonthEnd);
    const prevExpense = calculateTotalExpense(transactions, prevMonthStart, prevMonthEnd);

    const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpense > 0 ? ((expense - prevExpense) / prevExpense) * 100 : 0;

    return {
      income,
      expense,
      balance,
      incomeChange,
      expenseChange,
    };
  }, [transactions]);

  const totalBalance = useMemo(() => calculateTotalWalletBalance(wallets), [wallets]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const expenses = calculateExpenseByCategory(transactions, monthStart, monthEnd);
    return expenses.slice(0, 5).map((cat) => ({
      name: cat.categoryName,
      value: cat.total,
    }));
  }, [transactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        const aCreated = new Date(a.createdAt).getTime();
        const bCreated = new Date(b.createdAt).getTime();

        // Sort by date first, then by createdAt (timestamp) for same-day transactions
        return aDate !== bDate ? bDate - aDate : bCreated - aCreated;
      })
      .slice(0, 5);
  }, [transactions]);

  // Alerts
  const alerts = useMemo(() => {
    const alerts = [];

    // Check upcoming bills
    const upcomingBills = bills.filter((bill) => {
      if (bill.isPaid) return false;
      const dueDate = new Date(bill.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3 && daysUntilDue >= 0;
    });

    if (upcomingBills.length > 0) {
      alerts.push({
        type: "warning",
        message: `${upcomingBills.length} tagihan akan jatuh tempo dalam 3 hari`,
      });
    }

    return alerts;
  }, [bills, budgets, transactions]);

  const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            marginBottom: "var(--space-2)",
          }}
        >
          <h1 style={{ margin: 0 }}>Selamat datang, {user?.name || user?.email?.split("@")[0] || "User"}! 👋</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>Ringkasan keuangan Anda bulan ini</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          {alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-4)",
                background: "var(--warning-bg)",
                border: "1px solid var(--warning-border)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-3)",
              }}
            >
              <AlertCircle size={20} style={{ color: "var(--warning-text)" }} />
              <span style={{ color: "var(--warning-text)", fontWeight: 500 }}>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: "var(--space-8)" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Total Saldo</span>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-lg)",
                background: "var(--primary-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wallet size={20} style={{ color: "var(--primary-600)" }} />
            </div>
          </div>
          <h2 style={{ margin: 0, marginBottom: 0, display: "block", wordBreak: "break-word" }}>{formatCurrency(totalBalance)}</h2>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Pemasukan</span>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-lg)",
                background: "var(--success-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowUpCircle size={20} style={{ color: "var(--success-text)" }} />
            </div>
          </div>
          <h2 style={{ margin: 0, marginBottom: "var(--space-2)" }}>{formatCurrency(currentMonthStats.income)}</h2>
          {currentMonthStats.incomeChange !== 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              {currentMonthStats.incomeChange > 0 ? <TrendingUp size={16} style={{ color: "var(--success-text)" }} /> : <TrendingDown size={16} style={{ color: "var(--error-text)" }} />}
              <span
                style={{
                  fontSize: "0.875rem",
                  color: currentMonthStats.incomeChange > 0 ? "var(--success-text)" : "var(--error-text)",
                  fontWeight: 500,
                }}
              >
                {Math.abs(currentMonthStats.incomeChange).toFixed(1)}% vs bulan lalu
              </span>
            </div>
          )}
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Pengeluaran</span>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-lg)",
                background: "var(--error-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowDownCircle size={20} style={{ color: "var(--error-text)" }} />
            </div>
          </div>
          <h2 style={{ margin: 0, marginBottom: "var(--space-2)" }}>{formatCurrency(currentMonthStats.expense)}</h2>
          {currentMonthStats.expenseChange !== 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              {currentMonthStats.expenseChange > 0 ? <TrendingUp size={16} style={{ color: "var(--error-text)" }} /> : <TrendingDown size={16} style={{ color: "var(--success-text)" }} />}
              <span
                style={{
                  fontSize: "0.875rem",
                  color: currentMonthStats.expenseChange > 0 ? "var(--error-text)" : "var(--success-text)",
                  fontWeight: 500,
                }}
              >
                {Math.abs(currentMonthStats.expenseChange).toFixed(1)}% vs bulan lalu
              </span>
            </div>
          )}
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Saldo Bulan Ini</span>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-lg)",
                background: currentMonthStats.balance >= 0 ? "var(--success-bg)" : "var(--error-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp
                size={20}
                style={{
                  color: currentMonthStats.balance >= 0 ? "var(--success-text)" : "var(--error-text)",
                }}
              />
            </div>
          </div>
          <h2
            style={{
              margin: 0,
              color: currentMonthStats.balance >= 0 ? "var(--success-text)" : "var(--error-text)",
            }}
          >
            {formatCurrency(currentMonthStats.balance)}
          </h2>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: "var(--space-8)" }}>
        <Card>
          <h3 style={{ marginBottom: "var(--space-6)" }}>Pengeluaran per Kategori</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-tertiary)",
              }}
            >
              Belum ada data pengeluaran
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ marginBottom: "var(--space-6)" }}>Transaksi Terbaru</h3>
          {recentTransactions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-3)",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{txn.categoryName || "Transaksi"}</p>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>{new Date(txn.date).toLocaleDateString("id-ID")}</p>
                  </div>
                  <span
                    style={{
                      fontWeight: 600,
                      color: txn.type === "income" ? "var(--success-text)" : "var(--error-text)",
                    }}
                  >
                    {txn.type === "income" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-tertiary)",
              }}
            >
              Belum ada transaksi
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
