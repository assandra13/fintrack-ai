import React, { useState } from "react";
import { useData } from "../contexts/DataContext";
import { useNotification } from "../contexts/NotificationContext";
import { formatCurrency } from "../utils/formatters";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ModernModal from "../components/common/ModernModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Input from "../components/common/Input";
import NumberInput from "../components/common/NumberInput";
import ModernSelect from "../components/common/ModernSelect";
import { Plus, Edit2, Trash2, ArrowRightLeft, Wallet as WalletIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { presetColors } from "../data/colors";
import { availableIcons } from "../data/icons";

const Wallets = () => {
  const { wallets, addWallet, updateWallet, deleteWallet, transferBetweenWallets } = useData();
  const notification = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [editingWallet, setEditingWallet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    icon: "Wallet",
    color: "#3b82f6",
  });
  const [transferData, setTransferData] = useState({
    fromWalletId: "",
    toWalletId: "",
    amount: "",
  });

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const walletData = {
      ...formData,
      balance: parseFloat(formData.balance) || 0,
    };

    if (editingWallet) {
      updateWallet(editingWallet.id, walletData);
    } else {
      addWallet(walletData);
    }

    setShowModal(false);
    setEditingWallet(null);
    setFormData({
      name: "",
      balance: "",
      icon: "Wallet",
      color: "#3b82f6",
    });
  };

  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      balance: wallet.balance.toString(),
      icon: wallet.icon,
      color: wallet.color,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setWalletToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (walletToDelete) {
      deleteWallet(walletToDelete);
      setShowDeleteConfirm(false);
      setWalletToDelete(null);
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();

    if (transferData.fromWalletId === transferData.toWalletId) {
      notification.error("Tidak bisa transfer ke wallet yang sama!");
      return;
    }

    transferBetweenWallets(transferData.fromWalletId, transferData.toWalletId, parseFloat(transferData.amount));

    setShowTransferModal(false);
    setTransferData({
      fromWalletId: "",
      toWalletId: "",
      amount: "",
    });
  };

  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Wallet;
    return <IconComponent size={24} />;
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Wallet</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Kelola semua wallet dan akun keuangan Anda</p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setShowTransferModal(true)}>
            <ArrowRightLeft size={18} />
            Transfer
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Tambah Wallet
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card style={{ marginBottom: "var(--space-6)", background: "var(--gradient-ocean)", color: "white", border: "none" }}>
        <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "0.875rem" }}>Total Saldo Semua Wallet</p>
          <h1 style={{ margin: "var(--space-3) 0", fontSize: "2.5rem" }}>{formatCurrency(totalBalance)}</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "0.875rem" }}>{wallets.length} Wallet Aktif</p>
        </div>
      </Card>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <Card key={wallet.id} style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "var(--space-4)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-xl)",
                  background: wallet.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {getIconComponent(wallet.icon)}
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(wallet)}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(wallet.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <h3 style={{ marginBottom: "var(--space-2)" }}>{wallet.name}</h3>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                margin: 0,
                color: wallet.balance >= 0 ? "var(--success-text)" : "var(--error-text)",
              }}
            >
              {formatCurrency(wallet.balance)}
            </p>
          </Card>
        ))}

        {wallets.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "var(--space-8)",
              textAlign: "center",
              color: "var(--text-tertiary)",
            }}
          >
            <WalletIcon size={48} style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
            <p>Belum ada wallet. Tambahkan wallet pertama Anda!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Wallet Modal */}
      <ModernModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingWallet(null);
        }}
        title={editingWallet ? "Edit Wallet" : "Tambah Wallet"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="wallet-form">
              {editingWallet ? "Simpan" : "Tambah"}
            </Button>
          </>
        }
      >
        <form id="wallet-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Input label="Nama Wallet" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Cash, Bank BCA, GoPay" required />

          <NumberInput label="Saldo Awal" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} placeholder="0" currency="IDR" required />

          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)", display: "block" }}>Icon</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "var(--space-2)",
                maxHeight: "200px",
                overflowY: "auto",
                padding: "var(--space-2)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {availableIcons.slice(0, 32).map((iconName) => {
                const IconComponent = Icons[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    style={{
                      padding: "var(--space-2)",
                      border: formData.icon === iconName ? "2px solid var(--primary-500)" : "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      background: formData.icon === iconName ? "var(--primary-50)" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)", display: "block" }}>Warna</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "var(--space-2)",
              }}
            >
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: color,
                    border: formData.color === color ? "3px solid var(--text-primary)" : "1px solid var(--border-color)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                />
              ))}
            </div>
          </div>
        </form>
      </ModernModal>

      {/* Transfer Modal */}
      <ModernModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Antar Wallet"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="transfer-form">
              Transfer
            </Button>
          </>
        }
      >
        <form id="transfer-form" onSubmit={handleTransfer} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <ModernSelect
            label="Dari Wallet"
            value={transferData.fromWalletId}
            onChange={(e) => setTransferData({ ...transferData, fromWalletId: e.target.value })}
            options={wallets.map((w) => ({ value: w.id, label: `${w.name} (${formatCurrency(w.balance)})` }))}
            required
          />

          <ModernSelect
            label="Ke Wallet"
            value={transferData.toWalletId}
            onChange={(e) => setTransferData({ ...transferData, toWalletId: e.target.value })}
            options={wallets.map((w) => ({ value: w.id, label: `${w.name} (${formatCurrency(w.balance)})` }))}
            required
          />

          <NumberInput label="Jumlah" value={transferData.amount} onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} placeholder="0" currency="IDR" required />
        </form>
      </ModernModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Hapus Wallet"
        message="Yakin ingin menghapus wallet ini? Semua transaksi terkait akan terpengaruh."
        confirmText="Ya, Hapus"
        variant="danger"
      />
    </div>
  );
};

export default Wallets;
