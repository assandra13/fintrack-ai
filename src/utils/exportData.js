// Export data to CSV format
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        throw new Error('No data to export');
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Export data to JSON format
export const exportToJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Export transactions to CSV
export const exportTransactionsToCSV = (transactions) => {
    const data = transactions.map(t => ({
        Tanggal: new Date(t.date).toLocaleDateString('id-ID'),
        Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        Kategori: t.categoryName,
        Wallet: t.walletName,
        Jumlah: t.amount,
        Deskripsi: t.description || '',
        Tags: t.tags ? t.tags.join(', ') : '',
    }));

    const filename = `transaksi_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(data, filename);
};

// Export all data (backup)
export const exportAllData = (allData) => {
    const filename = `fintrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    exportToJSON(allData, filename);
};
