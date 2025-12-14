import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import { calculateGoalProgress } from "../utils/calculations";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ModernModal from "../components/common/ModernModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Input from "../components/common/Input";
import NumberInput from "../components/common/NumberInput";
import ModernDatePicker from "../components/common/ModernDatePicker";
import { Plus, Edit2, Trash2, PiggyBank, TrendingUp, Calendar, CheckCircle, DollarSign } from "lucide-react";

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, allocateToGoal } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [allocateAmount, setAllocateAmount] = useState("");

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => ({
      ...goal,
      ...calculateGoalProgress(goal),
    }));
  }, [goals]);

  const activeGoals = goalsWithProgress.filter((g) => !g.isCompleted);
  const completedGoals = goalsWithProgress.filter((g) => g.isCompleted);

  const handleSubmit = (e) => {
    e.preventDefault();

    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }

    setShowModal(false);
    setEditingGoal(null);
    setFormData({
      name: "",
      targetAmount: "",
      deadline: "",
      description: "",
    });
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      deadline: new Date(goal.deadline).toISOString().split("T")[0],
      description: goal.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setGoalToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setShowDeleteConfirm(false);
      setGoalToDelete(null);
    }
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    allocateToGoal(selectedGoal.id, parseFloat(allocateAmount));
    setShowAllocateModal(false);
    setSelectedGoal(null);
    setAllocateAmount("");
  };

  const GoalCard = ({ goal }) => (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "var(--radius-xl)",
              background: goal.isCompleted ? "var(--success-bg)" : "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: goal.isCompleted ? "var(--success-text)" : "white",
            }}
          >
            {goal.isCompleted ? <CheckCircle size={28} /> : <PiggyBank size={28} />}
          </div>
          <div>
            <h4 style={{ margin: 0, marginBottom: "var(--space-1)" }}>{goal.name}</h4>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>{goal.description}</p>
          </div>
        </div>
        {!goal.isCompleted && (
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
              <Edit2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "var(--space-4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Progress</span>
          <span style={{ fontSize: "1rem", fontWeight: 600 }}>
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        <div className="progress">
          <div className="progress-bar progress-bar-success" style={{ width: `${Math.min(goal.percentage, 100)}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--success-text)" }}>{goal.percentage.toFixed(1)}% tercapai</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Sisa: {formatCurrency(goal.remaining)}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--space-3)",
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
          marginBottom: goal.isCompleted ? 0 : "var(--space-3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Calendar size={16} style={{ color: "var(--text-tertiary)" }} />
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Deadline: {formatDate(goal.deadline)}</span>
        </div>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: goal.daysRemaining < 0 ? "var(--error-text)" : goal.daysRemaining < 30 ? "var(--warning-text)" : "var(--text-secondary)",
          }}
        >
          {goal.daysRemaining < 0 ? "Terlambat" : `${goal.daysRemaining} hari lagi`}
        </span>
      </div>

      {!goal.isCompleted && (
        <Button
          style={{ width: "100%" }}
          onClick={() => {
            setSelectedGoal(goal);
            setShowAllocateModal(true);
          }}
        >
          <DollarSign size={18} />
          Alokasikan Dana
        </Button>
      )}

      {goal.isCompleted && (
        <div
          style={{
            padding: "var(--space-3)",
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--success-text)",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          🎉 Goal Tercapai!
        </div>
      )}
    </Card>
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Goals</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Tetapkan dan capai target tabungan Anda</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Tambah Goal
          </Button>
        </div>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Goals Aktif</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Goals Tercapai</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card>
          <div
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              color: "var(--text-tertiary)",
            }}
          >
            <PiggyBank size={48} style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
            <p>Belum ada goal. Mulai tetapkan target tabungan Anda!</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Goal Modal */}
      <ModernModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? "Edit Goal" : "Tambah Goal"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="goal-form">
              {editingGoal ? "Simpan" : "Tambah"}
            </Button>
          </>
        }
      >
        <form id="goal-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Input label="Nama Goal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Liburan ke Bali, iPhone 15" required />

          <NumberInput label="Target Nominal" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} placeholder="0" currency="IDR" required />

          <ModernDatePicker label="Deadline" value={formData.deadline} onChange={(date) => setFormData({ ...formData, deadline: date })} required />

          <Input label="Deskripsi" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Opsional" />
        </form>
      </ModernModal>

      {/* Allocate Modal */}
      <ModernModal
        isOpen={showAllocateModal}
        onClose={() => {
          setShowAllocateModal(false);
          setSelectedGoal(null);
        }}
        title={`Alokasikan Dana ke ${selectedGoal?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAllocateModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="allocate-form">
              Alokasikan
            </Button>
          </>
        }
      >
        <form id="allocate-form" onSubmit={handleAllocate} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {selectedGoal && (
            <div
              style={{
                padding: "var(--space-4)",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Saat ini:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(selectedGoal.currentAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Target:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(selectedGoal.targetAmount)}</span>
              </div>
            </div>
          )}

          <NumberInput label="Jumlah yang Dialokasikan" value={allocateAmount} onChange={(e) => setAllocateAmount(e.target.value)} placeholder="0" currency="IDR" required />

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
            💡 Dana yang dialokasikan akan ditambahkan ke progress goal Anda.
          </div>
        </form>
      </ModernModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={confirmDelete} title="Hapus Goal" message="Yakin ingin menghapus goal ini?" confirmText="Ya, Hapus" variant="danger" />
    </div>
  );
};

export default Goals;
