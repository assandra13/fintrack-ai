// Preset color palette untuk categories dan wallets
export const presetColors = [
    '#ef4444', // red
    '#f59e0b', // orange
    '#eab308', // yellow
    '#84cc16', // lime
    '#10b981', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
    '#6b7280', // gray
];

export const colorNames = {
    '#ef4444': 'Merah',
    '#f59e0b': 'Oranye',
    '#eab308': 'Kuning',
    '#84cc16': 'Hijau Lime',
    '#10b981': 'Hijau',
    '#14b8a6': 'Teal',
    '#06b6d4': 'Cyan',
    '#0ea5e9': 'Biru Langit',
    '#3b82f6': 'Biru',
    '#6366f1': 'Indigo',
    '#8b5cf6': 'Violet',
    '#a855f7': 'Ungu',
    '#d946ef': 'Fuchsia',
    '#ec4899': 'Pink',
    '#f43f5e': 'Rose',
    '#6b7280': 'Abu-abu',
};

export const getColorName = (hex) => {
    return colorNames[hex] || 'Custom';
};
