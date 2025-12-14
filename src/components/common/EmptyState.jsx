import React from 'react';
import { FileX, Inbox, TrendingUp } from 'lucide-react';

const EmptyState = ({
    icon: Icon = Inbox,
    title = 'Tidak ada data',
    description = 'Belum ada data yang tersedia',
    action,
    actionLabel = 'Tambah Data'
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-12)',
            textAlign: 'center',
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-6)',
            }}>
                <Icon size={40} style={{ color: 'var(--text-tertiary)' }} />
            </div>

            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
            }}>
                {title}
            </h3>

            <p style={{
                color: 'var(--text-secondary)',
                marginBottom: action ? 'var(--space-6)' : 0,
                maxWidth: '400px',
            }}>
                {description}
            </p>

            {action && (
                <button
                    onClick={action}
                    className="btn btn-primary"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
