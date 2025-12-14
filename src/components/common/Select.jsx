import React from 'react';

const Select = ({
    label,
    error,
    options = [],
    value,
    onChange,
    placeholder = 'Pilih...',
    className = '',
    ...props
}) => {
    const selectClass = error ? 'input input-error' : 'input';

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {label}
                </label>
            )}
            <select
                className={`${selectClass} ${className}`}
                value={value}
                onChange={onChange}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span style={{ fontSize: '0.75rem', color: 'var(--error-text)' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;
