import React, { useState, useRef, useEffect } from 'react';

const NumberInput = ({
    label,
    value,
    onChange,
    required = false,
    placeholder = '0',
    currency = 'IDR',
    error = null,
    ...props
}) => {
    const [displayValue, setDisplayValue] = useState('');
    const inputRef = useRef(null);

    // Format number dengan thousand separator
    const formatNumber = (num) => {
        if (!num) return '';
        // Remove non-digits
        const number = num.toString().replace(/\D/g, '');
        // Add thousand separator
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Parse formatted number ke number
    const parseNumber = (str) => {
        if (!str) return 0;
        return parseInt(str.replace(/\./g, ''), 10) || 0;
    };

    // Update display value saat value prop berubah
    useEffect(() => {
        setDisplayValue(formatNumber(value));
    }, [value]);

    const handleChange = (e) => {
        const input = e.target.value;
        // Remove all non-digits
        const numericValue = input.replace(/\D/g, '');

        // Update display dengan format
        setDisplayValue(formatNumber(numericValue));

        // Call onChange dengan number value
        if (onChange) {
            onChange({
                target: {
                    name: e.target.name,
                    value: parseNumber(numericValue),
                },
            });
        }
    };

    const handleFocus = () => {
        // Select all on focus untuk easier editing
        if (inputRef.current) {
            inputRef.current.select();
        }
    };

    return (
        <div style={{ marginBottom: 'var(--space-4)' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                }}>
                    {label} {required && <span style={{ color: 'var(--error-text)' }}>*</span>}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {currency && (
                    <span style={{
                        position: 'absolute',
                        left: 'var(--space-4)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        pointerEvents: 'none',
                    }}>
                        {currency === 'IDR' ? 'Rp' : currency}
                    </span>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    required={required}
                    className={error ? 'input input-error' : 'input'}
                    style={{
                        paddingLeft: currency ? 'calc(var(--space-4) + 2.5rem)' : 'var(--space-4)',
                    }}
                    {...props}
                />
            </div>
            {error && (
                <p style={{
                    marginTop: 'var(--space-2)',
                    fontSize: '0.75rem',
                    color: 'var(--error-text)',
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default NumberInput;
