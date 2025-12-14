import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const ModernDatePicker = ({
    label,
    value,
    onChange,
    error,
    required,
    placeholder = 'Pick a date'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (date) => {
        setSelectedDate(date);
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            onChange({ target: { value: formattedDate } });
        }
        setIsOpen(false);
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
                    {label}
                    {required && <span style={{ color: 'var(--error-solid)' }}> *</span>}
                </label>
            )}

            <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--bg-primary)',
                        border: `1px solid ${error ? 'var(--error-solid)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        fontSize: '0.875rem',
                        color: selectedDate ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                >
                    <CalendarIcon size={16} />
                    <span>
                        {selectedDate ? format(selectedDate, 'dd MMM yyyy') : placeholder}
                    </span>
                </button>

                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 1000,
                        padding: 'var(--space-4)',
                        animation: 'slideDown 0.2s ease-out',
                    }}>
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            styles={{
                                root: {
                                    '--rdp-cell-size': '40px',
                                    '--rdp-accent-color': 'var(--primary-600)',
                                    '--rdp-background-color': 'var(--primary-100)',
                                    fontFamily: 'var(--font-primary)',
                                },
                                day: {
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all var(--transition-fast)',
                                },
                                day_selected: {
                                    background: 'var(--primary-600)',
                                    color: 'white',
                                    fontWeight: 600,
                                },
                                day_today: {
                                    fontWeight: 600,
                                    color: 'var(--primary-600)',
                                },
                            }}
                        />
                    </div>
                )}
            </div>

            {error && (
                <p style={{
                    marginTop: 'var(--space-1)',
                    fontSize: '0.75rem',
                    color: 'var(--error-solid)',
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default ModernDatePicker;
