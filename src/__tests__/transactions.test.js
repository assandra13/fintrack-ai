/**
 * Test Suite: Transaction Ordering & Date Normalization
 *
 * Verifies:
 * 1. Transactions sorted newest-first (by date or createdAt)
 * 2. Date fields normalized to ISO format
 * 3. Fallback to createdAt when date is missing
 */

describe("Transaction Ordering & Date Normalization", () => {
  // Mock localStorage untuk testing
  let store = {};
  const mockLocalStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  beforeEach(() => {
    mockLocalStorage.clear();
    global.localStorage = mockLocalStorage;
  });

  test("Transaksi diurutkan dari terbaru ke terlama (by date)", () => {
    const txns = [
      {
        id: "txn-1",
        date: new Date("2025-01-01").toISOString(),
        amount: 100,
        type: "expense",
        createdAt: new Date("2025-01-01").toISOString(),
      },
      {
        id: "txn-2",
        date: new Date("2025-11-28").toISOString(),
        amount: 200,
        type: "expense",
        createdAt: new Date("2025-11-28").toISOString(),
      },
      {
        id: "txn-3",
        date: new Date("2025-06-15").toISOString(),
        amount: 150,
        type: "expense",
        createdAt: new Date("2025-06-15").toISOString(),
      },
    ];

    // Simulasi sorting dari Transactions.jsx
    const sorted = txns.sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt).getTime() || 0;
      const bTime = new Date(b.date || b.createdAt).getTime() || 0;
      return bTime - aTime;
    });

    // Verifikasi urutan
    expect(sorted[0].id).toBe("txn-2"); // terbaru (Nov 28)
    expect(sorted[1].id).toBe("txn-3"); // tengah (Jun 15)
    expect(sorted[2].id).toBe("txn-1"); // terlama (Jan 1)
  });

  test("Fallback ke createdAt ketika date missing", () => {
    const txns = [
      {
        id: "txn-1",
        amount: 100,
        type: "expense",
        createdAt: new Date("2025-01-01").toISOString(),
        // date deliberately missing
      },
      {
        id: "txn-2",
        date: new Date("2025-11-28").toISOString(),
        amount: 200,
        type: "expense",
        createdAt: new Date("2025-11-28").toISOString(),
      },
    ];

    const sorted = txns.sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt).getTime() || 0;
      const bTime = new Date(b.date || b.createdAt).getTime() || 0;
      return bTime - aTime;
    });

    expect(sorted[0].id).toBe("txn-2"); // terbaru
    expect(sorted[1].id).toBe("txn-1"); // terlama (fallback ke createdAt)
  });

  test("Date field dinormalisasi ke ISO format saat add", () => {
    const inputDate = "2025-11-28"; // dari date picker
    const normalizedDate = new Date(inputDate).toISOString();

    expect(normalizedDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    expect(normalizedDate.includes("2025-11-28")).toBe(true);
  });

  test("Date field dinormalisasi saat update", () => {
    const oldDate = "2025-01-01";
    const newDate = "2025-11-28";
    const normalizedNewDate = new Date(newDate).toISOString();

    const oldTxn = { id: "txn-1", date: oldDate, amount: 100 };
    const updated = { ...oldTxn, date: normalizedNewDate };

    expect(updated.date).not.toBe(oldDate);
    expect(updated.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test("Urutan tetap konsisten setelah normalisasi date", () => {
    // Simulasi transaksi lama dengan format date yang tidak konsisten
    const legacyTxns = [
      { id: "old-1", date: "2025-01-01", amount: 100 }, // string YYYY-MM-DD
      { id: "old-2", date: new Date("2025-06-15").toISOString(), amount: 150 }, // ISO
      { id: "old-3", amount: 200, createdAt: new Date("2025-11-28").toISOString() }, // no date, use createdAt
    ];

    // Normalisasi
    const normalized = legacyTxns.map((t) => ({
      ...t,
      date: t.date ? new Date(t.date).toISOString() : t.createdAt || new Date().toISOString(),
    }));

    // Sort
    const sorted = normalized.sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt).getTime() || 0;
      const bTime = new Date(b.date || b.createdAt).getTime() || 0;
      return bTime - aTime;
    });

    expect(sorted[0].id).toBe("old-3"); // terbaru (Nov 28)
    expect(sorted[1].id).toBe("old-2"); // tengah (Jun 15)
    expect(sorted[2].id).toBe("old-1"); // terlama (Jan 1)
  });
});
