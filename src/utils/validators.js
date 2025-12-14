// Validate email
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password minimal 8 karakter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password harus mengandung huruf besar');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password harus mengandung huruf kecil');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password harus mengandung angka');
    }

    return {
        isValid: errors.length === 0,
        errors,
        strength: getPasswordStrength(password),
    };
};

const getPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
};

// Validate amount
export const validateAmount = (amount) => {
    const num = parseFloat(amount);

    if (isNaN(num)) {
        return { isValid: false, error: 'Jumlah harus berupa angka' };
    }

    if (num <= 0) {
        return { isValid: false, error: 'Jumlah harus lebih dari 0' };
    }

    if (num > 999999999999) {
        return { isValid: false, error: 'Jumlah terlalu besar' };
    }

    return { isValid: true, value: num };
};

// Validate required field
export const validateRequired = (value, fieldName = 'Field') => {
    if (!value || value.toString().trim() === '') {
        return { isValid: false, error: `${fieldName} wajib diisi` };
    }
    return { isValid: true };
};

// Validate date
export const validateDate = (date) => {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return { isValid: false, error: 'Format tanggal tidak valid' };
    }

    return { isValid: true, value: d };
};

// Validate future date
export const validateFutureDate = (date) => {
    const validation = validateDate(date);
    if (!validation.isValid) return validation;

    const now = new Date();
    const d = new Date(date);

    if (d <= now) {
        return { isValid: false, error: 'Tanggal harus di masa depan' };
    }

    return { isValid: true, value: d };
};
