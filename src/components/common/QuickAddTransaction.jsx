import React, { useState } from 'react';
import { Plus, X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const QuickAddTransaction = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { addTransaction, categories, wallets } = useData();
    const { success } = useNotification();
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        categoryId: '',
        walletId: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const category = categories.find(c => c.id === formData.categoryId);
        const wallet = wallets.find(w => w.id === formData.walletId);

        const transactionData = {
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date().toISOString(),
            categoryName: category?.name || '',
            walletName: wallet?.name || '',
        };

        addTransaction(transactionData);
        success(`Transaksi ${formData.type === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil ditambahkan!`);

        setIsOpen(false);
        setFormData({
            type: 'expense',
            amount: '',
            categoryId: '',
            walletId: '',
            description: '',
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: 'var(--space-6)',
                    right: 'var(--space-6)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all var(--transition-normal)',
                    zIndex: 1000,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
            >
                <Plus size={24} />
            </button>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 'var(--space-6)',
                right: 'var(--space-6)',
                width: '360px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                padding: 'var(--space-5)',
                zIndex: 1000,
                animation: 'slideUp 0.3s ease-out',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ margin: 0 }}>Quick Add</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 'var(--space-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)',
                        transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {/* Type Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                        style={{
                            padding: 'var(--space-3)',
                            border: formData.type === 'income' ? '2px solid var(--success-solid)' : '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: formData.type === 'income' ? 'var(--success-bg)' : 'var(--bg-secondary)',
                            color: formData.type === 'income' ? 'var(--success-text)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                            fontWeight: 500,
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        <TrendingUp size={18} />
                        Income
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                        style={{
                            padding: 'var(--space-3)',
                            border: formData.type === 'expense' ? '2px solid var(--error-solid)' : '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: formData.type === 'expense' ? 'var(--error-bg)' : 'var(--bg-secondary)',
                            color: formData.type === 'expense' ? 'var(--error-text)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                            fontWeight: 500,
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        <TrendingDown size={18} />
                        Expense
                    </button>
                </div>

                <Input
                    label="Jumlah"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    required
                />

                <Select
                    label="Kategori"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    options={categories
                        .filter(c => c.type === formData.type)
                        .map(c => ({ value: c.id, label: c.name }))}
                    required
                />

                <Select
                    label="Wallet"
                    value={formData.walletId}
                    onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                    options={wallets.map(w => ({ value: w.id, label: w.name }))}
                    required
                />

                <Input
                    label="Deskripsi"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Opsional"
                />

                <Button type="submit" style={{ width: '100%' }}>
                    <DollarSign size={18} />
                    Tambah Transaksi
                </Button>
            </form>
        </div>
    );
};

export default QuickAddTransaction;
