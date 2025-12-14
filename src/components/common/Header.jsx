import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Bell, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header
            className="app-header"
            style={{
                height: '70px',
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-color)',
                padding: '0 var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Greeting Section */}
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Selamat datang, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 'var(--space-2)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <button
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 'var(--space-2)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        transition: 'all var(--transition-fast)',
                        position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                >
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--error-solid)',
                        borderRadius: '50%',
                    }} />
                </button>

                {/* User menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                        }}
                    >
                        {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                    </button>

                    {showUserMenu && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    zIndex: 999,
                                }}
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)',
                                minWidth: '200px',
                                zIndex: 1000,
                                animation: 'slideDown 0.2s ease-out',
                            }}>
                                <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
                                    <p style={{ margin: 0, fontWeight: 600 }}>{user?.name || user?.email?.split('@')[0] || 'User'}</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3) var(--space-4)',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        transition: 'background var(--transition-fast)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Settings size={18} />
                                    Pengaturan
                                </button>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3) var(--space-4)',
                                        background: 'transparent',
                                        border: 'none',
                                        borderTop: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        color: 'var(--error-text)',
                                        fontSize: '0.875rem',
                                        transition: 'background var(--transition-fast)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--error-bg)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <LogOut size={18} />
                                    Keluar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
