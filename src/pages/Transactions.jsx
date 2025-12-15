import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, Edit2, Trash2, TrendingUp, TrendingDown, X } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatters";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ModernSelect from "../components/common/ModernSelect";
import ModernDatePicker from "../components/common/ModernDatePicker";
import ModernModal from "../components/common/ModernModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import NumberInput from "../components/common/NumberInput";
import TagManager from "../components/common/TagManager";
import AttachmentUpload from "../components/common/AttachmentUpload";

const Transactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, categories, wallets } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterWallet, setFilterWallet] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterAmountMin, setFilterAmountMin] = useState("");
  const [filterAmountMax, setFilterAmountMax] = useState("");
  const [filterTags, setFilterTags] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    categoryId: "",
    subCategoryId: "",
    walletId: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    tags: "",
    attachment: null,
    isRecurring: false,
    frequency: "monthly",
  });

  const filteredTransactions = useMemo(
    () =>
      transactions
        .filter((t) => {
          const matchesSearch = !searchTerm || (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) || (t.categoryName && t.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesType = !filterType || t.type === filterType;
          const matchesWallet = !filterWallet || t.walletId === filterWallet;
          const matchesCategory = !filterCategory || t.categoryId === filterCategory;

          const tDate = new Date(t.date);
          const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
          const toDate = filterDateTo ? new Date(filterDateTo) : null;
          const matchesDate = (!fromDate || tDate >= fromDate) && (!toDate || tDate <= toDate);

          const minAmount = filterAmountMin ? parseFloat(filterAmountMin) : 0;
          const maxAmount = filterAmountMax ? parseFloat(filterAmountMax) : Infinity;
          const matchesAmount = t.amount >= minAmount && t.amount <= maxAmount;

          const matchesTags = !filterTags || (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(filterTags.toLowerCase())));

          return matchesSearch && matchesType && matchesWallet && matchesDate && matchesAmount && matchesTags && matchesCategory;
        })
        .sort((a, b) => {
          const aDate = a.date ? new Date(a.date).getTime() : 0;
          const bDate = b.date ? new Date(b.date).getTime() : 0;
          const aCreatedTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreatedTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const aAmount = a.amount || 0;
          const bAmount = b.amount || 0;

          switch (sortBy) {
            case "date_desc":
              return aDate !== bDate ? bDate - aDate : bCreatedTime - aCreatedTime;
            case "date_asc":
              return aDate !== bDate ? aDate - bDate : aCreatedTime - bCreatedTime;
            case "amount_high":
              return bAmount - aAmount;
            case "amount_low":
              return aAmount - bAmount;
            default:
              return bDate - aDate;
          }
        }),
    [transactions, searchTerm, filterType, filterWallet, filterCategory, filterDateFrom, filterDateTo, filterAmountMin, filterAmountMax, filterTags, sortBy]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const category = categories.find((c) => c.id === formData.categoryId);
    const wallet = wallets.find((w) => w.id === formData.walletId);
    const subCategory = formData.subCategoryId ? categories.find((c) => c.id === formData.subCategoryId) : null;

    // Parse tags from comma-separated string to array
    const tags = formData.tags
      ? formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      : [];

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      categoryName: category?.name || "",
      subCategoryName: subCategory?.name || "",
      walletName: wallet?.name || "",
      tags: tags,
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      amount: "",
      categoryId: "",
      subCategoryId: "",
      walletId: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      tags: "",
      attachment: null,
      isRecurring: false,
      frequency: "monthly",
    });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      categoryId: transaction.categoryId,
      subCategoryId: transaction.subCategoryId || "",
      walletId: transaction.walletId,
      date: new Date(transaction.date).toISOString().split("T")[0],
      description: transaction.description || "",
      tags: transaction.tags ? transaction.tags.join(", ") : "",
      attachment: transaction.attachment || null,
      isRecurring: transaction.isRecurring || false,
      frequency: transaction.frequency || "monthly",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTransactionToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setShowDeleteConfirm(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Transaksi</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Kelola semua transaksi keuangan Anda</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: "var(--space-6)" }}>
        <div style={{ marginBottom: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-3)" }}>🔎 Pencarian & Filter</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-4)" }}>
            <Input placeholder="🔍 Cari transaksi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <ModernSelect
              placeholder="Filter tipe"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: "", label: "Semua Tipe" },
                { value: "income", label: "📈 Pemasukan" },
                { value: "expense", label: "💸 Pengeluaran" },
              ]}
            />
            <ModernSelect
              placeholder="Filter wallet"
              value={filterWallet}
              onChange={(e) => setFilterWallet(e.target.value)}
              options={[{ value: "", label: "Semua Wallet" }, ...wallets.map((w) => ({ value: w.id, label: `${w.name} (${formatCurrency(w.balance)})` }))]}
            />
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-4)", fontSize: "1rem", fontWeight: 600 }}>📅 Filter Tanggal & Nominal</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div>
              <ModernDatePicker label="Dari Tanggal" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} placeholder="Pilih tanggal awal" />
              {filterDateFrom && <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", marginTop: "var(--space-1)", fontWeight: 500 }}>✓ {formatDate(filterDateFrom)}</div>}
            </div>
            <div>
              <ModernDatePicker label="Sampai Tanggal" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} placeholder="Pilih tanggal akhir" />
              {filterDateTo && <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", marginTop: "var(--space-1)", fontWeight: 500 }}>✓ {formatDate(filterDateTo)}</div>}
            </div>
            <Input label={`Jumlah Min (IDR)${filterAmountMin ? ` - ${formatNumber(parseInt(filterAmountMin))}` : ""}`} type="number" value={filterAmountMin} onChange={(e) => setFilterAmountMin(e.target.value)} placeholder="0" min="0" />
            <Input
              label={`Jumlah Max (IDR)${filterAmountMax ? ` - ${formatNumber(parseInt(filterAmountMax))}` : ""}`}
              type="number"
              value={filterAmountMax}
              onChange={(e) => setFilterAmountMax(e.target.value)}
              placeholder="Unlimited"
              min="0"
            />
            <Input label="🏷️ Cari Tag" type="text" value={filterTags} onChange={(e) => setFilterTags(e.target.value)} placeholder="misalnya: groceries" />
          </div>

          {(filterDateFrom || filterDateTo || filterAmountMin || filterAmountMax || filterTags) && (
            <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3)", background: "var(--primary-50)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "var(--space-2)" }}>Filter Aktif:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {filterDateFrom && (
                  <span className="badge" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
                    📅 Dari: {formatDate(filterDateFrom)} <X size={12} style={{ marginLeft: "var(--space-1)", cursor: "pointer" }} onClick={() => setFilterDateFrom("")} />
                  </span>
                )}
                {filterDateTo && (
                  <span className="badge" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
                    📅 Sampai: {formatDate(filterDateTo)} <X size={12} style={{ marginLeft: "var(--space-1)", cursor: "pointer" }} onClick={() => setFilterDateTo("")} />
                  </span>
                )}
                {filterAmountMin && (
                  <span className="badge" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
                    💰 Min: {formatNumber(parseInt(filterAmountMin))} <X size={12} style={{ marginLeft: "var(--space-1)", cursor: "pointer" }} onClick={() => setFilterAmountMin("")} />
                  </span>
                )}
                {filterAmountMax && (
                  <span className="badge" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
                    💰 Max: {formatNumber(parseInt(filterAmountMax))} <X size={12} style={{ marginLeft: "var(--space-1)", cursor: "pointer" }} onClick={() => setFilterAmountMax("")} />
                  </span>
                )}
                {filterTags && (
                  <span className="badge" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
                    🏷️ {filterTags} <X size={12} style={{ marginLeft: "var(--space-1)", cursor: "pointer" }} onClick={() => setFilterTags("")} />
                  </span>
                )}
              </div>
            </div>
          )}

          <div style={{ paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-color)" }}>
            <h4 style={{ marginBottom: "var(--space-3)", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>Urutkan Berdasarkan</h4>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {[
                { value: "date_desc", label: "📅 Terbaru" },
                { value: "date_asc", label: "📅 Terlama" },
                { value: "amount_high", label: "💰 Tertinggi" },
                { value: "amount_low", label: "💰 Terendah" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
                  style={{
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card>
        <h3 style={{ marginBottom: "var(--space-4)" }}>Semua Transaksi</h3>

        {filteredTransactions.length === 0 ? (
          <div
            style={{
              padding: "var(--space-12)",
              textAlign: "center",
              color: "var(--text-tertiary)",
            }}
          >
            <p style={{ fontSize: "1.125rem", marginBottom: "var(--space-2)" }}>Belum ada transaksi</p>
            <p style={{ fontSize: "0.875rem" }}>Mulai catat transaksi keuangan Anda</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-4)",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-lg)",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flex: 1 }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-lg)",
                      background: transaction.type === "income" ? "var(--income-bg)" : "var(--expense-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: transaction.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                    }}
                  >
                    {transaction.type === "income" ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                        {categories.find((c) => c.id === transaction.categoryId)?.parentId && `📁 ${categories.find((c) => c.id === categories.find((cat) => cat.id === transaction.categoryId)?.parentId)?.name} / `}
                        {transaction.categoryName}
                      </span>
                      <span className={`badge badge-${transaction.type === "income" ? "income" : "expense"}`} style={{ fontWeight: 600, fontSize: "0.75rem" }}>
                        {transaction.type === "income" ? "📈 Pemasukan" : "💸 Pengeluaran"}
                      </span>
                      {transaction.isRecurring && (
                        <span className="badge" style={{ background: "var(--warning-50)", color: "var(--warning-solid)", fontSize: "0.75rem", fontWeight: 600, border: "1px solid var(--warning-200)" }}>
                          🔁 {transaction.frequency ? `Tiap ${transaction.frequency}` : "Berulang"}
                        </span>
                      )}
                      {transaction.attachment && (
                        <span className="badge" style={{ background: "var(--primary-50)", color: "var(--primary-700)", fontSize: "0.75rem", fontWeight: 600, border: "1px solid var(--primary-200)" }}>
                          📸 Lampiran
                        </span>
                      )}
                    </div>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
                        {transaction.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge"
                            style={{ background: "var(--primary-100)", color: "var(--primary-700)", fontSize: "0.75rem", fontWeight: 500, padding: "var(--space-1) var(--space-2)", borderRadius: "var(--radius-md)" }}
                          >
                            🏷️ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "0.875rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 500 }}>👛 {transaction.walletName}</span>
                      <span>•</span>
                      <span>📅 {formatDate(transaction.date)}</span>
                      {transaction.description && (
                        <>
                          <span>•</span>
                          <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{transaction.description}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", marginRight: "var(--space-4)" }}>
                    <div
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: transaction.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button onClick={() => handleEdit(transaction)} className="btn btn-ghost btn-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(transaction.id)} className="btn btn-ghost btn-sm" style={{ color: "var(--error-solid)" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <ModernModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
        size="lg"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingTransaction(null);
              }}
            >
              Batal
            </Button>
            <Button type="submit" form="transaction-form">
              {editingTransaction ? "Simpan" : "Tambah"}
            </Button>
          </>
        }
      >
        <form id="transaction-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
            <ModernSelect
              label="💸 Tipe Transaksi"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: "" })}
              options={[
                { value: "income", label: "📈 Pemasukan" },
                { value: "expense", label: "💸 Pengeluaran" },
              ]}
              required
            />

            <NumberInput label="💰 Jumlah" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0" currency="IDR" required />

            <ModernSelect
              label="📁 Kategori"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories.filter((c) => c.type === formData.type && !c.parentId).map((c) => ({ value: c.id, label: c.name }))}
              required
            />

            {formData.categoryId && categories.find((c) => c.id === formData.categoryId)?.id && (
              <ModernSelect
                label="📌 Sub-Kategori (Opsional)"
                value={formData.subCategoryId || ""}
                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                options={[{ value: "", label: "Tidak ada" }, ...categories.filter((c) => c.parentId === formData.categoryId).map((c) => ({ value: c.id, label: c.name }))]}
              />
            )}
          </div>

          <ModernSelect
            label="👛 Wallet"
            value={formData.walletId}
            onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
            options={wallets.map((w) => ({ value: w.id, label: `${w.name} (${formatCurrency(w.balance)})` }))}
            required
          />

          <ModernDatePicker label="📅 Tanggal" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />

          <Input label="📝 Deskripsi (Opsional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Contoh: Belanja groceries di supermarket" />

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)" }}>
            <h4 style={{ marginBottom: "var(--space-3)", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase" }}>🏷️ Tag & Label</h4>
            <TagManager
              tags={formData.tags ? formData.tags.split(",").map((t) => t.trim()) : []}
              onTagsChange={(newTags) => setFormData({ ...formData, tags: newTags.join(", ") })}
              placeholder="Tambah tag (contoh: groceries, urgent, dll)"
            />
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)" }}>
            <h4 style={{ marginBottom: "var(--space-3)", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase" }}>🔁 Transaksi Berulang</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked, frequency: "monthly" })}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <label htmlFor="isRecurring" style={{ cursor: "pointer", marginBottom: 0, fontWeight: 500 }}>
                Aktifkan pengulangan otomatis untuk transaksi ini
              </label>
            </div>

            {formData.isRecurring && (
              <ModernSelect
                label="Frekuensi Pengulangan"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                options={[
                  { value: "daily", label: "📆 Harian" },
                  { value: "weekly", label: "📅 Mingguan" },
                  { value: "biweekly", label: "📊 Dua Mingguan" },
                  { value: "monthly", label: "📅 Bulanan" },
                  { value: "quarterly", label: "📈 Triwulanan" },
                  { value: "yearly", label: "🎯 Tahunan" },
                ]}
                required={formData.isRecurring}
              />
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)" }}>
            <h4 style={{ marginBottom: "var(--space-3)", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase" }}>📸 Lampiran Bukti/Struk</h4>
            <AttachmentUpload attachment={formData.attachment} onAttachmentChange={(att) => setFormData({ ...formData, attachment: att })} onRemove={() => setFormData({ ...formData, attachment: null })} />
          </div>
        </form>
      </ModernModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={confirmDelete} title="Hapus Transaksi" message="Yakin ingin menghapus transaksi ini?" confirmText="Ya, Hapus" variant="danger" />
    </div>
  );
};

export default Transactions;
