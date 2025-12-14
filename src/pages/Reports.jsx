import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { formatCurrency, formatPercentage, formatDate } from "../utils/formatters";
import { calculateTotalIncome, calculateTotalExpense, calculateExpenseByCategory, generateInsights, calculateTrendData } from "../utils/calculations";
import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns";
import Card from "../components/common/Card";
import ModernSelect from "../components/common/ModernSelect";
import { TrendingUp, TrendingDown, Calendar, Download, Lightbulb } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import Button from "../components/common/Button";
import { exportTransactionsToCSV, exportAllData } from "../utils/exportData";

const Reports = () => {
  const { transactions, categories } = useData();
  const [period, setPeriod] = useState("monthly");

  const { startDate, endDate, prevStartDate, prevEndDate } = useMemo(() => {
    const now = new Date();
    let start, end, prevStart, prevEnd;

    if (period === "weekly") {
      start = startOfWeek(now);
      end = endOfWeek(now);
      prevStart = startOfWeek(subMonths(now, 0));
      prevEnd = endOfWeek(subMonths(now, 0));
    } else if (period === "monthly") {
      start = startOfMonth(now);
      end = endOfMonth(now);
      prevStart = startOfMonth(subMonths(now, 1));
      prevEnd = endOfMonth(subMonths(now, 1));
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
      prevStart = startOfYear(subMonths(now, 12));
      prevEnd = endOfYear(subMonths(now, 12));
    }

    return { startDate: start, endDate: end, prevStartDate: prevStart, prevEndDate: prevEnd };
  }, [period]);

  const stats = useMemo(() => {
    const income = calculateTotalIncome(transactions, startDate, endDate);
    const expense = calculateTotalExpense(transactions, startDate, endDate);
    const balance = income - expense;

    const prevIncome = calculateTotalIncome(transactions, prevStartDate, prevEndDate);
    const prevExpense = calculateTotalExpense(transactions, prevStartDate, prevEndDate);

    const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpense > 0 ? ((expense - prevExpense) / prevExpense) * 100 : 0;

    return {
      income,
      expense,
      balance,
      incomeChange,
      expenseChange,
      savingsRate: income > 0 ? (balance / income) * 100 : 0,
    };
  }, [transactions, startDate, endDate, prevStartDate, prevEndDate]);

  const categoryBreakdown = useMemo(() => {
    return calculateExpenseByCategory(transactions, startDate, endDate);
  }, [transactions, startDate, endDate]);

  const trendData = useMemo(() => {
    const days = period === "weekly" ? 7 : period === "monthly" ? 30 : 365;
    return calculateTrendData(transactions, days);
  }, [transactions, period]);

  const insights = useMemo(() => {
    const prevTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= prevStartDate && date <= prevEndDate;
    });
    return generateInsights(transactions, prevTransactions);
  }, [transactions, prevStartDate, prevEndDate]);

  const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#a855f7"];

  const handleExportTransactions = () => {
    const periodTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
    exportTransactionsToCSV(periodTransactions);
  };

  const handleExportAll = () => {
    exportAllData({
      transactions,
      categories,
      exportDate: new Date().toISOString(),
    });
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Laporan & Analisis</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Analisis mendalam tentang keuangan Anda</p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ minWidth: "180px", flex: "0 0 auto" }}>
            <ModernSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={[
                { value: "weekly", label: "Mingguan" },
                { value: "monthly", label: "Bulanan" },
                { value: "yearly", label: "Tahunan" },
              ]}
            />
          </div>
          <Button variant="secondary" onClick={handleExportTransactions} style={{ whiteSpace: "nowrap", flex: "0 0 auto", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: "var(--space-8)" }}>
        <Card>
          <div style={{ marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Total Pemasukan</span>
            <h2 style={{ margin: "var(--space-2) 0", color: "var(--success-text)" }}>{formatCurrency(stats.income)}</h2>
            {stats.incomeChange !== 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                {stats.incomeChange > 0 ? <TrendingUp size={16} style={{ color: "var(--success-text)" }} /> : <TrendingDown size={16} style={{ color: "var(--error-text)" }} />}
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: stats.incomeChange > 0 ? "var(--success-text)" : "var(--error-text)",
                    fontWeight: 500,
                  }}
                >
                  {Math.abs(stats.incomeChange).toFixed(1)}% vs periode lalu
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Total Pengeluaran</span>
            <h2 style={{ margin: "var(--space-2) 0", color: "var(--error-text)" }}>{formatCurrency(stats.expense)}</h2>
            {stats.expenseChange !== 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                {stats.expenseChange > 0 ? <TrendingUp size={16} style={{ color: "var(--error-text)" }} /> : <TrendingDown size={16} style={{ color: "var(--success-text)" }} />}
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: stats.expenseChange > 0 ? "var(--error-text)" : "var(--success-text)",
                    fontWeight: 500,
                  }}
                >
                  {Math.abs(stats.expenseChange).toFixed(1)}% vs periode lalu
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Net Balance</span>
            <h2
              style={{
                margin: "var(--space-2) 0",
                color: stats.balance >= 0 ? "var(--success-text)" : "var(--error-text)",
              }}
            >
              {formatCurrency(stats.balance)}
            </h2>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{stats.balance >= 0 ? "Surplus" : "Defisit"}</span>
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Savings Rate</span>
            <h2
              style={{
                margin: "var(--space-2) 0",
                color: stats.savingsRate >= 20 ? "var(--success-text)" : "var(--warning-text)",
              }}
            >
              {formatPercentage(stats.savingsRate)}
            </h2>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{stats.savingsRate >= 20 ? "Bagus!" : "Perlu ditingkatkan"}</span>
          </div>
        </Card>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <Card style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
            <Lightbulb size={24} style={{ color: "var(--warning-solid)" }} />
            <h3 style={{ margin: 0 }}>Insights & Rekomendasi</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {insights.map((insight, index) => (
              <div
                key={index}
                style={{
                  padding: "var(--space-3)",
                  background: insight.type === "success" ? "var(--success-bg)" : insight.type === "warning" ? "var(--warning-bg)" : "var(--info-bg)",
                  border: `1px solid ${insight.type === "success" ? "var(--success-border)" : insight.type === "warning" ? "var(--warning-border)" : "var(--info-border)"}`,
                  borderRadius: "var(--radius-md)",
                  color: insight.type === "success" ? "var(--success-text)" : insight.type === "warning" ? "var(--warning-text)" : "var(--info-text)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {insight.message}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: "var(--space-8)" }}>
        {/* Trend Chart */}
        <Card>
          <h3 style={{ marginBottom: "var(--space-6)" }}>Tren Keuangan</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" style={{ fontSize: "0.75rem" }} />
                <YAxis stroke="var(--text-tertiary)" style={{ fontSize: "0.75rem" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="var(--success-solid)" strokeWidth={2} name="Pemasukan" />
                <Line type="monotone" dataKey="expense" stroke="var(--error-solid)" strokeWidth={2} name="Pengeluaran" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>Belum ada data</div>
          )}
        </Card>

        {/* Category Pie Chart */}
        <Card>
          <h3 style={{ marginBottom: "var(--space-6)" }}>Pengeluaran per Kategori</h3>
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown.slice(0, 8).map((cat) => ({ name: cat.categoryName, value: cat.total }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>Belum ada data pengeluaran</div>
          )}
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card>
        <h3 style={{ marginBottom: "var(--space-4)" }}>Detail Pengeluaran per Kategori</h3>
        {categoryBreakdown.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {categoryBreakdown.map((cat, index) => (
              <div
                key={cat.categoryId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-3)",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1 }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: COLORS[index % COLORS.length],
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: "var(--space-1)" }}>{cat.categoryName}</h4>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{cat.count} transaksi</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>{formatCurrency(cat.total)}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{formatPercentage((cat.total / stats.expense) * 100)} dari total</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              color: "var(--text-tertiary)",
            }}
          >
            Belum ada data pengeluaran
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
