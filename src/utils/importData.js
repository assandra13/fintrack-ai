// Import data from CSV
export const importFromCSV = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n');

                if (lines.length < 2) {
                    reject(new Error('File CSV kosong'));
                    return;
                }

                // Parse headers
                const headers = lines[0].split(',').map(h => h.trim());

                // Parse data
                const data = [];
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;

                    const values = lines[i].split(',').map(v => v.trim());
                    const row = {};

                    headers.forEach((header, index) => {
                        row[header] = values[index];
                    });

                    data.push(row);
                }

                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Gagal membaca file'));
        };

        reader.readAsText(file);
    });
};

// Import data from JSON
export const importFromJSON = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (error) {
                reject(new Error('Format JSON tidak valid'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Gagal membaca file'));
        };

        reader.readAsText(file);
    });
};

// Validate imported transaction data
export const validateImportedTransactions = (data) => {
    const errors = [];
    const validTransactions = [];

    data.forEach((row, index) => {
        const lineNum = index + 2; // +2 because index starts at 0 and we skip header

        // Validate required fields
        if (!row.Tanggal) {
            errors.push(`Baris ${lineNum}: Tanggal wajib diisi`);
            return;
        }

        if (!row.Tipe || !['Pemasukan', 'Pengeluaran'].includes(row.Tipe)) {
            errors.push(`Baris ${lineNum}: Tipe harus "Pemasukan" atau "Pengeluaran"`);
            return;
        }

        if (!row.Jumlah || isNaN(parseFloat(row.Jumlah))) {
            errors.push(`Baris ${lineNum}: Jumlah harus berupa angka`);
            return;
        }

        // Convert to transaction format
        validTransactions.push({
            date: new Date(row.Tanggal).toISOString(),
            type: row.Tipe === 'Pemasukan' ? 'income' : 'expense',
            amount: parseFloat(row.Jumlah),
            categoryName: row.Kategori || 'Lainnya',
            walletName: row.Wallet || 'Cash',
            description: row.Deskripsi || '',
            tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
        });
    });

    return { validTransactions, errors };
};
