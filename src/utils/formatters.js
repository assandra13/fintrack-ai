// Format currency berdasarkan locale dan currency code
export const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format number dengan thousand separator
export const formatNumber = (number, decimals = 0) => {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
};

// Format date
export const formatDate = (date, format = 'short') => {
    const d = new Date(date);

    if (format === 'short') {
        // 23 Nov 2025
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } else if (format === 'long') {
        // 23 November 2025
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } else if (format === 'full') {
        // Sabtu, 23 November 2025
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } else if (format === 'time') {
        // 12:43
        return d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } else if (format === 'datetime') {
        // 23 Nov 2025, 12:43
        return `${formatDate(d, 'short')}, ${formatDate(d, 'time')}`;
    }

    return d.toLocaleDateString('id-ID');
};

// Format relative date (e.g., "2 hari yang lalu")
export const formatRelativeDate = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
        return 'Baru saja';
    } else if (diffMins < 60) {
        return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
        return `${diffHours} jam yang lalu`;
    } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} minggu yang lalu`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} bulan yang lalu`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} tahun yang lalu`;
    }
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
};

// Shorten large numbers (e.g., 1000000 -> 1M)
export const formatCompactNumber = (number) => {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'M';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'Jt';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'Rb';
    }
    return number.toString();
};
