import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const notification = { id, message, type, duration };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        addNotification(message, 'success', duration);
    }, [addNotification]);

    const error = useCallback((message, duration) => {
        addNotification(message, 'error', duration);
    }, [addNotification]);

    const info = useCallback((message, duration) => {
        addNotification(message, 'info', duration);
    }, [addNotification]);

    const warning = useCallback((message, duration) => {
        addNotification(message, 'warning', duration);
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{ success, error, info, warning }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = ({ notifications, onRemove }) => {
    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            maxWidth: '400px',
        }}>
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    onRemove={() => onRemove(notification.id)}
                />
            ))}
        </div>
    );
};

const Notification = ({ notification, onRemove }) => {
    const { type, message } = notification;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertCircle size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    const getStyles = () => {
        const baseStyles = {
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.3s ease-out',
            minWidth: '300px',
        };

        switch (type) {
            case 'success':
                return {
                    ...baseStyles,
                    background: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    color: 'var(--success-text)',
                };
            case 'error':
                return {
                    ...baseStyles,
                    background: 'var(--error-bg)',
                    border: '1px solid var(--error-border)',
                    color: 'var(--error-text)',
                };
            case 'warning':
                return {
                    ...baseStyles,
                    background: 'var(--warning-bg)',
                    border: '1px solid var(--warning-border)',
                    color: 'var(--warning-text)',
                };
            default:
                return {
                    ...baseStyles,
                    background: 'var(--info-bg)',
                    border: '1px solid var(--info-border)',
                    color: 'var(--info-text)',
                };
        }
    };

    return (
        <div style={getStyles()}>
            {getIcon()}
            <span style={{ flex: 1, fontWeight: 500, fontSize: '0.875rem' }}>{message}</span>
            <button
                onClick={onRemove}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'var(--space-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7,
                    transition: 'opacity var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
            >
                <X size={16} />
            </button>
        </div>
    );
};
