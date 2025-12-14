import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import { calculateBudgetProgress } from "../utils/calculations";
import { startOfMonth, endOfMonth } from "date-fns";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ModernModal from "../components/common/ModernModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Input from "../components/common/Input";
import NumberInput from "../components/common/NumberInput";
import ModernSelect from "../components/common/ModernSelect";
import ModernDatePicker from "../components/common/ModernDatePicker";
import { Plus, Edit2, Trash2, Target, AlertTriangle } from "lucide-react";

const Budgets = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, categories, transactions } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split("T")[0].slice(0, 7)); // Format: YYYY-MM
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    period: "monthly",
  });

  const budgetsWithProgress = useMemo(() => {
    return budgets.map((budget) => {
      const progress = calculateBudgetProgress(budget, transactions, selectedMonth);
      const category = categories.find((c) => c.id === budget.categoryId);
      return {
        ...budget,
        ...progress,
        categoryName: category?.name || "Unknown",
        categoryColor: category?.color || "#6b7280",
      };
    });
  }, [budgets, transactions, categories, selectedMonth]);

  // Get historical budget data
  const getMonthlyBudgetHistory = useMemo(() => {
    const history = {};
    const months = new Set();

    // Collect all months from transactions
    transactions.forEach((t) => {
      const month = new Date(t.date).toISOString().split("T")[0].slice(0, 7);
      months.add(month);
    });

    // Generate last 12 months if no transaction data
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toISOString().split("T")[0].slice(0, 7);
      months.add(month);
    }

    // Build history for each month
    Array.from(months)
      .sort()
      .forEach((month) => {
        history[month] = {};
        budgets.forEach((budget) => {
          const monthStart = new Date(month + "-01");
          const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

          const monthTransactions = transactions.filter((t) => {
            const tDate = new Date(t.date);
            return tDate >= monthStart && tDate <= monthEnd && t.categoryId === budget.categoryId && t.type === "expense";
          });

          const spent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
          history[month][budget.id] = {
            budgetAmount: budget.amount,
            spent: spent,
            percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
            remaining: budget.amount - spent,
          };
        });
      });

    return history;
  }, [budgets, transactions]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetsWithProgress.reduce((sum, b) => sum + b.spent, 0);
  const totalProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    const category = categories.find((c) => c.id === formData.categoryId);
    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount),
      categoryName: category?.name || "",
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }

    setShowModal(false);
    setEditingBudget(null);
    setFormData({
      categoryId: "",
      amount: "",
      period: "monthly",
    });
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setBudgetToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setShowDeleteConfirm(false);
      setBudgetToDelete(null);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "var(--error-solid)";
    if (percentage >= 80) return "var(--warning-solid)";
    return "var(--success-solid)";
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Budget</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Atur dan pantau budget pengeluaran Anda</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Tambah Budget
          </Button>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: "250px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>📅 Bulan:</label>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <ModernDatePicker value={selectedMonth + "-01"} onChange={(e) => setSelectedMonth(e.target.value.slice(0, 7))} placeholder="Pilih bulan" />
            </div>
          </div>
        </div>
      </div>

      {/* Total Budget Overview */}
      <div style={{ marginBottom: "var(--space-6)", padding: "var(--space-6)", background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)", borderRadius: "var(--radius-lg)", color: "white" }}>
        <div style={{ marginBottom: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem" }}>💰 Total Budget Bulan Ini</h3>
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: totalProgress >= 100 ? "#fca5a5" : "#86efac",
              }}
            >
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="progress" style={{ backgroundColor: "rgba(255,255,255,0.2)", height: "8px", borderRadius: "var(--radius-md)" }}>
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(totalProgress, 100)}%`,
                background: totalProgress >= 100 ? "#fca5a5" : totalProgress >= 80 ? "#fbbf24" : "#86efac",
                height: "8px",
                borderRadius: "var(--radius-md)",
                transition: "width var(--transition-fast)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-4)" }}>
            <div>
              <div style={{ fontSize: "0.875rem", opacity: 0.9, marginBottom: "var(--space-1)" }}>Terpakai</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{formatPercentage(totalProgress)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.875rem", opacity: 0.9, marginBottom: "var(--space-1)" }}>Sisa</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: totalBudget - totalSpent >= 0 ? "#86efac" : "#fca5a5" }}>{formatCurrency(totalBudget - totalSpent)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget History */}
      {Object.keys(getMonthlyBudgetHistory).length > 0 && (
        <div style={{ marginBottom: "var(--space-6)", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", padding: "var(--space-6)", overflowX: "auto" }}>
          <h3 style={{ marginBottom: "var(--space-4)", fontWeight: 700, marginTop: 0 }}>📊 Riwayat Budget (12 Bulan Terakhir)</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary-300)" }}>
                  <th style={{ padding: "var(--space-4) var(--space-3)", textAlign: "left", fontWeight: 700, fontSize: "0.875rem", color: "var(--primary-700)" }}>📅 Bulan</th>
                  {budgetsWithProgress.map((budget) => (
                    <th key={budget.id} style={{ padding: "var(--space-4) var(--space-3)", textAlign: "right", fontWeight: 700, fontSize: "0.875rem", color: "var(--primary-700)" }}>
                      {budget.categoryName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(getMonthlyBudgetHistory)
                  .sort()
                  .reverse()
                  .slice(0, 12)
                  .map((month) => (
                    <tr key={month} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-primary)" }}>
                      <td style={{ padding: "var(--space-4) var(--space-3)", fontWeight: 600, color: "var(--text-primary)" }}>📆 {new Date(month + "-01").toLocaleDateString("id-ID", { year: "numeric", month: "long" })}</td>
                      {budgetsWithProgress.map((budget) => {
                        const data = getMonthlyBudgetHistory[month][budget.id];
                        const statusColor = data.percentage > 100 ? "#dc2626" : data.percentage > 80 ? "#ea580c" : "#16a34a";
                        return (
                          <td key={budget.id} style={{ padding: "var(--space-4) var(--space-3)", textAlign: "right", fontSize: "0.875rem" }}>
                            <div style={{ color: statusColor, fontWeight: 700, marginBottom: "var(--space-1)" }}>{formatCurrency(data.spent)}</div>
                            <div style={{ color: statusColor, fontSize: "0.75rem", fontWeight: 600 }}>
                              {formatPercentage(data.percentage)} / {formatCurrency(data.budgetAmount)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budget List */}
      {budgetsWithProgress.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {budgetsWithProgress.map((budget) => (
            <div key={budget.id} style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", padding: "var(--space-4)", transition: "all var(--transition-fast)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "var(--radius-lg)",
                      background: budget.categoryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1.75rem",
                    }}
                  >
                    🎯
                  </div>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: "var(--space-1)", fontWeight: 700, fontSize: "1.125rem" }}>{budget.categoryName}</h4>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>Budget Bulanan</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  {budget.isOverBudget && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        padding: "var(--space-2) var(--space-3)",
                        background: "#fee2e2",
                        borderRadius: "var(--radius-md)",
                        color: "#dc2626",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        border: "1px solid #fecaca",
                      }}
                    >
                      <AlertTriangle size={16} />
                      Over Budget
                    </div>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(budget.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-4)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 600 }}>💸 Pengeluaran</span>
                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: budget.isOverBudget ? "var(--error-solid)" : "var(--primary-700)",
                      }}
                    >
                      {formatCurrency(budget.spent)}
                    </span>
                  </div>
                  <div className="progress" style={{ height: "10px", borderRadius: "var(--radius-md)" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min(budget.percentage, 100)}%`,
                        background: getProgressColor(budget.percentage),
                        transition: "width var(--transition-fast)",
                        height: "10px",
                        borderRadius: "var(--radius-md)",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{formatPercentage(budget.percentage)}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>dari {formatCurrency(budget.amount)}</span>
                  </div>
                </div>

                <div
                  style={{
                    background: budget.remaining >= 0 ? "rgba(16,185,129,0.1)" : "rgba(220,38,38,0.1)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-3)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-1)", fontWeight: 500 }}>Sisa Budget</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: budget.remaining >= 0 ? "var(--success-solid)" : "var(--error-solid)" }}>{budget.remaining >= 0 ? "✓" : "⚠️"}</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: budget.remaining >= 0 ? "var(--success-solid)" : "var(--error-solid)", marginTop: "var(--space-1)" }}>{formatCurrency(Math.abs(budget.remaining))}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              color: "var(--text-tertiary)",
            }}
          >
            <Target size={48} style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
            <p>Belum ada budget. Mulai atur budget untuk mengontrol pengeluaran Anda!</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <ModernModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? "Edit Budget" : "Tambah Budget"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="budget-form">
              {editingBudget ? "Simpan" : "Tambah"}
            </Button>
          </>
        }
      >
        <form id="budget-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <ModernSelect
            label="Kategori"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={categories.filter((c) => c.type === "expense").map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <NumberInput label="Jumlah Budget" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0" currency="IDR" required />

          <ModernSelect
            label="Periode"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            options={[
              { value: "monthly", label: "Bulanan" },
              { value: "weekly", label: "Mingguan" },
              { value: "yearly", label: "Tahunan" },
            ]}
          />

          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--info-bg)",
              border: "1px solid var(--info-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              color: "var(--info-text)",
            }}
          >
            💡 Budget akan dipantau secara otomatis. Anda akan mendapat notifikasi saat mendekati atau melebihi budget.
          </div>
        </form>
      </ModernModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={confirmDelete} title="Hapus Budget" message="Yakin ingin menghapus budget ini?" confirmText="Ya, Hapus" variant="danger" />
    </div>
  );
};

export default Budgets;
