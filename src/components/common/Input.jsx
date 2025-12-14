import React from 'react';

const Input = ({
    label,
    error,
    type = 'text',
    className = '',
    ...props
}) => {
    const inputClass = error ? 'input input-error' : 'input';

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`${inputClass} ${className}`}
                {...props}
            />
            {error && (
                <span style={{ fontSize: '0.75rem', color: 'var(--error-text)' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
