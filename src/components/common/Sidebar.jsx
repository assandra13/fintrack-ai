import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    FolderOpen,
    Target,
    PiggyBank,
    Receipt,
    BarChart3,
    Settings,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/transactions', icon: ArrowLeftRight, label: 'Transaksi' },
        { path: '/wallets', icon: Wallet, label: 'Wallet' },
        { path: '/categories', icon: FolderOpen, label: 'Kategori' },
        { path: '/budgets', icon: Target, label: 'Budget' },
        { path: '/goals', icon: PiggyBank, label: 'Goals' },
        { path: '/bills', icon: Receipt, label: 'Tagihan' },
        { path: '/reports', icon: BarChart3, label: 'Laporan' },
        { path: '/settings', icon: Settings, label: 'Pengaturan' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        display: 'none',
                    }}
                    className="mobile-overlay"
                    onClick={onClose}
                />
            )}

            <aside className="sidebar" style={{
                height: '100vh',
                background: 'var(--bg-elevated)',
                borderRight: '1px solid var(--border-color)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                top: 0,
                zIndex: 1000,
            }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        fontSize: '1.5rem',
                    }}>
                        FinTrack AI
                    </h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                padding: 'var(--space-3) var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary-50)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.875rem',
                                transition: 'all var(--transition-fast)',
                            })}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.classList.contains('active')) {
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.classList.contains('active')) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-xl)',
                    color: 'white',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '0.875rem', margin: 0, marginBottom: 'var(--space-2)' }}>
                        💡 <strong>Tips:</strong>
                    </p>
                    <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.9 }}>
                        Catat setiap transaksi untuk kontrol keuangan yang lebih baik!
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
