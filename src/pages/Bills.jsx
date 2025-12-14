import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ModernModal from "../components/common/ModernModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Input from "../components/common/Input";
import NumberInput from "../components/common/NumberInput";
import ModernSelect from "../components/common/ModernSelect";
import ModernDatePicker from "../components/common/ModernDatePicker";
import { Plus, Edit2, Trash2, Receipt, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const Bills = () => {
  const { bills, addBill, updateBill, deleteBill, markBillAsPaid, categories, wallets } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billToPay, setBillToPay] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [billToDelete, setBillToDelete] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: new Date().toISOString().split("T")[0],
    categoryId: "",
    recurring: false,
    reminderDays: "3",
  });

  const billsWithStatus = useMemo(() => {
    return bills.map((bill) => {
      const dueDate = new Date(bill.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      let status = "upcoming";
      if (bill.isPaid) {
        status = "paid";
      } else if (daysUntilDue < 0) {
        status = "overdue";
      } else if (daysUntilDue <= parseInt(bill.reminderDays || 3)) {
        status = "due-soon";
      }

      const category = categories.find((c) => c.id === bill.categoryId);

      return {
        ...bill,
        daysUntilDue,
        status,
        categoryName: category?.name || "Lainnya",
      };
    });
  }, [bills, categories]);

  const upcomingBills = billsWithStatus.filter((b) => !b.isPaid && b.status !== "overdue").sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  const overdueBills = billsWithStatus.filter((b) => !b.isPaid && b.status === "overdue");
  const paidBills = billsWithStatus.filter((b) => b.isPaid);

  const handleSubmit = (e) => {
    e.preventDefault();

    const category = categories.find((c) => c.id === formData.categoryId);
    const billData = {
      ...formData,
      amount: parseFloat(formData.amount),
      categoryName: category?.name || "",
    };

    if (editingBill) {
      updateBill(editingBill.id, billData);
    } else {
      addBill(billData);
    }

    setShowModal(false);
    setEditingBill(null);
    setFormData({
      name: "",
      amount: "",
      dueDate: "",
      categoryId: "",
      recurring: false,
      reminderDays: "3",
    });
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: new Date(bill.dueDate).toISOString().split("T")[0],
      categoryId: bill.categoryId,
      recurring: bill.recurring || false,
      reminderDays: bill.reminderDays?.toString() || "3",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setBillToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (billToDelete) {
      deleteBill(billToDelete);
      setShowDeleteConfirm(false);
      setBillToDelete(null);
    }
  };

  const handleMarkPaid = (bill) => {
    setBillToPay(bill);
    setSelectedWallet(wallets[0]?.id || "");
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    if (billToPay && selectedWallet) {
      markBillAsPaid(billToPay.id, selectedWallet);
      setShowPaymentModal(false);
      setBillToPay(null);
      setSelectedWallet("");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: { label: "Lunas", class: "badge-success" },
      overdue: { label: "Terlambat", class: "badge-error" },
      "due-soon": { label: "Segera Jatuh Tempo", class: "badge-warning" },
      upcoming: { label: "Akan Datang", class: "badge-info" },
    };
    const badge = badges[status] || badges.upcoming;
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  const BillCard = ({ bill }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-4)",
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1 }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-lg)",
            background: bill.isPaid ? "var(--success-bg)" : bill.status === "overdue" ? "var(--error-bg)" : bill.status === "due-soon" ? "var(--warning-bg)" : "var(--info-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: bill.isPaid ? "var(--success-text)" : bill.status === "overdue" ? "var(--error-text)" : bill.status === "due-soon" ? "var(--warning-text)" : "var(--info-text)",
          }}
        >
          {bill.isPaid ? <CheckCircle2 size={24} /> : bill.status === "overdue" ? <AlertCircle size={24} /> : bill.status === "due-soon" ? <Clock size={24} /> : <Receipt size={24} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
            <h4 style={{ margin: 0 }}>{bill.name}</h4>
            {getStatusBadge(bill.status)}
            {bill.recurring && (
              <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>
                Berulang
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <span>{bill.categoryName}</span>
            <span>•</span>
            <span>Jatuh tempo: {formatDate(bill.dueDate)}</span>
            {!bill.isPaid && bill.daysUntilDue >= 0 && (
              <>
                <span>•</span>
                <span>{bill.daysUntilDue} hari lagi</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: bill.isPaid ? "var(--success-text)" : "var(--text-primary)",
          }}
        >
          {formatCurrency(bill.amount)}
        </span>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {!bill.isPaid && (
            <Button size="sm" onClick={() => handleMarkPaid(bill)}>
              <CheckCircle2 size={16} />
              Bayar
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEdit(bill)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(bill.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Tagihan</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Kelola dan pantau tagihan rutin Anda</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Tambah Tagihan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: "var(--space-6)" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>Akan Jatuh Tempo</p>
              <h2 style={{ margin: "var(--space-2) 0 0 0" }}>{upcomingBills.length}</h2>
            </div>
            <Clock size={32} style={{ color: "var(--info-text)", opacity: 0.5 }} />
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>Terlambat</p>
              <h2 style={{ margin: "var(--space-2) 0 0 0", color: "var(--error-text)" }}>{overdueBills.length}</h2>
            </div>
            <AlertCircle size={32} style={{ color: "var(--error-text)", opacity: 0.5 }} />
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>Lunas</p>
              <h2 style={{ margin: "var(--space-2) 0 0 0", color: "var(--success-text)" }}>{paidBills.length}</h2>
            </div>
            <CheckCircle2 size={32} style={{ color: "var(--success-text)", opacity: 0.5 }} />
          </div>
        </Card>
      </div>

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ marginBottom: "var(--space-4)", color: "var(--error-text)" }}>⚠️ Tagihan Terlambat</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {overdueBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Tagihan Mendatang</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {upcomingBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Tagihan Lunas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {paidBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {bills.length === 0 && (
        <Card>
          <div
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              color: "var(--text-tertiary)",
            }}
          >
            <Receipt size={48} style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
            <p>Belum ada tagihan. Tambahkan tagihan rutin Anda untuk reminder otomatis!</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <ModernModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBill(null);
        }}
        title={editingBill ? "Edit Tagihan" : "Tambah Tagihan"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="bill-form">
              {editingBill ? "Simpan" : "Tambah"}
            </Button>
          </>
        }
      >
        <form id="bill-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Input label="Nama Tagihan" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Listrik, Internet, Cicilan" required />

          <NumberInput label="Jumlah" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0" currency="IDR" required />

          <ModernDatePicker label="Tanggal Jatuh Tempo" value={formData.dueDate} onChange={(date) => setFormData({ ...formData, dueDate: date })} required />

          <ModernSelect
            label="Kategori"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={categories.filter((c) => c.type === "expense").map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <Input label="Reminder (hari sebelumnya)" type="number" value={formData.reminderDays} onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })} placeholder="3" min="0" max="30" />

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <input type="checkbox" id="recurring" checked={formData.recurring} onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
            <label htmlFor="recurring" style={{ cursor: "pointer", fontSize: "0.875rem" }}>
              Tagihan berulang setiap bulan
            </label>
          </div>
        </form>
      </ModernModal>

      {/* Payment Modal */}
      <ModernModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setBillToPay(null);
          setSelectedWallet("");
        }}
        title="Bayar Tagihan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Batal
            </Button>
            <Button onClick={handlePaymentConfirm} disabled={!selectedWallet}>
              Konfirmasi Pembayaran
            </Button>
          </>
        }
      >
        {billToPay && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>Tagihan</p>
              <h3 style={{ margin: "var(--space-2) 0" }}>{billToPay.name}</h3>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>Jumlah</p>
              <h2 style={{ margin: "var(--space-2) 0", color: "var(--error-text)" }}>{formatCurrency(billToPay.amount)}</h2>
            </div>
            <ModernSelect
              label="Bayar dari Wallet"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              options={wallets.map((w) => ({
                value: w.id,
                label: `${w.name} (${formatCurrency(w.balance)})`,
              }))}
              required
            />
            <div
              style={{
                padding: "var(--space-3)",
                background: "var(--info-bg)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                color: "var(--info-text)",
              }}
            >
              💡 Pembayaran akan otomatis dicatat sebagai transaksi pengeluaran dan mengurangi saldo wallet yang dipilih.
            </div>
          </div>
        )}
      </ModernModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={confirmDelete} title="Hapus Tagihan" message="Yakin ingin menghapus tagihan ini?" confirmText="Ya, Hapus" variant="danger" />
    </div>
  );
};

export default Bills;
