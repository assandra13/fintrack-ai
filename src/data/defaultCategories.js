// Default categories untuk income dan expense
export const defaultCategories = [
    // Income Categories
    {
        id: 'income-salary',
        name: 'Gaji',
        type: 'income',
        icon: 'Briefcase',
        color: '#10b981',
        isDefault: true,
    },
    {
        id: 'income-freelance',
        name: 'Freelance',
        type: 'income',
        icon: 'Laptop',
        color: '#3b82f6',
        isDefault: true,
    },
    {
        id: 'income-investment',
        name: 'Investasi',
        type: 'income',
        icon: 'TrendingUp',
        color: '#8b5cf6',
        isDefault: true,
    },
    {
        id: 'income-business',
        name: 'Bisnis',
        type: 'income',
        icon: 'Store',
        color: '#06b6d4',
        isDefault: true,
    },
    {
        id: 'income-other',
        name: 'Lainnya',
        type: 'income',
        icon: 'Plus',
        color: '#6b7280',
        isDefault: true,
    },

    // Expense Categories
    {
        id: 'expense-food',
        name: 'Makanan & Minuman',
        type: 'expense',
        icon: 'UtensilsCrossed',
        color: '#f59e0b',
        isDefault: true,
        subcategories: [
            { id: 'expense-food-restaurant', name: 'Restoran', icon: 'UtensilsCrossed' },
            { id: 'expense-food-groceries', name: 'Belanja Groceries', icon: 'ShoppingCart' },
            { id: 'expense-food-coffee', name: 'Kopi & Snack', icon: 'Coffee' },
        ],
    },
    {
        id: 'expense-transport',
        name: 'Transportasi',
        type: 'expense',
        icon: 'Car',
        color: '#3b82f6',
        isDefault: true,
        subcategories: [
            { id: 'expense-transport-fuel', name: 'Bensin', icon: 'Fuel' },
            { id: 'expense-transport-public', name: 'Transportasi Umum', icon: 'Bus' },
            { id: 'expense-transport-ride', name: 'Ojek Online', icon: 'Bike' },
        ],
    },
    {
        id: 'expense-shopping',
        name: 'Belanja',
        type: 'expense',
        icon: 'ShoppingBag',
        color: '#ec4899',
        isDefault: true,
        subcategories: [
            { id: 'expense-shopping-clothes', name: 'Pakaian', icon: 'Shirt' },
            { id: 'expense-shopping-electronics', name: 'Elektronik', icon: 'Smartphone' },
            { id: 'expense-shopping-other', name: 'Lainnya', icon: 'ShoppingBag' },
        ],
    },
    {
        id: 'expense-entertainment',
        name: 'Hiburan',
        type: 'expense',
        icon: 'Gamepad2',
        color: '#8b5cf6',
        isDefault: true,
        subcategories: [
            { id: 'expense-entertainment-movies', name: 'Film & Bioskop', icon: 'Film' },
            { id: 'expense-entertainment-games', name: 'Games', icon: 'Gamepad2' },
            { id: 'expense-entertainment-subscription', name: 'Subscription', icon: 'Tv' },
        ],
    },
    {
        id: 'expense-health',
        name: 'Kesehatan',
        type: 'expense',
        icon: 'Heart',
        color: '#ef4444',
        isDefault: true,
        subcategories: [
            { id: 'expense-health-doctor', name: 'Dokter', icon: 'Stethoscope' },
            { id: 'expense-health-medicine', name: 'Obat', icon: 'Pill' },
            { id: 'expense-health-gym', name: 'Gym & Olahraga', icon: 'Dumbbell' },
        ],
    },
    {
        id: 'expense-bills',
        name: 'Tagihan',
        type: 'expense',
        icon: 'Receipt',
        color: '#dc2626',
        isDefault: true,
        subcategories: [
            { id: 'expense-bills-electricity', name: 'Listrik', icon: 'Zap' },
            { id: 'expense-bills-water', name: 'Air', icon: 'Droplet' },
            { id: 'expense-bills-internet', name: 'Internet', icon: 'Wifi' },
            { id: 'expense-bills-phone', name: 'Pulsa', icon: 'Phone' },
        ],
    },
    {
        id: 'expense-education',
        name: 'Pendidikan',
        type: 'expense',
        icon: 'GraduationCap',
        color: '#0ea5e9',
        isDefault: true,
    },
    {
        id: 'expense-housing',
        name: 'Rumah & Sewa',
        type: 'expense',
        icon: 'Home',
        color: '#14b8a6',
        isDefault: true,
    },
    {
        id: 'expense-insurance',
        name: 'Asuransi',
        type: 'expense',
        icon: 'Shield',
        color: '#6366f1',
        isDefault: true,
    },
    {
        id: 'expense-other',
        name: 'Lainnya',
        type: 'expense',
        icon: 'MoreHorizontal',
        color: '#6b7280',
        isDefault: true,
    },
];

export const getCategoryById = (id) => {
    return defaultCategories.find(cat => cat.id === id);
};

export const getCategoriesByType = (type) => {
    return defaultCategories.filter(cat => cat.type === type);
};
