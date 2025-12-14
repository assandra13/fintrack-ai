import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: '400px' },
        md: { maxWidth: '600px' },
        lg: { maxWidth: '800px' },
        xl: { maxWidth: '1000px' },
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal" style={sizeStyles[size]}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-6)',
                    paddingBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--border-color)',
                }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button
                        onClick={onClose}
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
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '0 var(--space-6)', marginBottom: footer ? 'var(--space-6)' : 0 }}>
                    {children}
                </div>

                {footer && (
                    <div style={{
                        padding: 'var(--space-4) var(--space-6)',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: 'var(--space-3)',
                        justifyContent: 'flex-end',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};

export default Modal;
