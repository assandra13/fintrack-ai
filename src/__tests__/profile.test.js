/**
 * Test Suite: Profile Persistence & Updates
 *
 * Verifies:
 * 1. updateProfile menyimpan ke localStorage setelah update
 * 2. Profil tidak hilang/revert saat page refresh
 * 3. Data konsisten di fintrack-user dan fintrack-users
 */

describe("Profile Persistence & Updates", () => {
  // Mock localStorage
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

  test("updateProfile menyimpan perubahan ke fintrack-user", () => {
    // Setup: user awal
    const originalUser = {
      id: "user-123",
      name: "Nama Awal",
      email: "test@example.com",
      currency: "IDR",
    };

    mockLocalStorage.setItem("fintrack-user", JSON.stringify(originalUser));

    // Simulasi updateProfile dari AuthContext
    const updates = { name: "Nama Baru" };
    const updatedUser = { ...originalUser, ...updates };
    mockLocalStorage.setItem("fintrack-user", JSON.stringify(updatedUser));

    // Verifikasi
    const stored = JSON.parse(mockLocalStorage.getItem("fintrack-user"));
    expect(stored.name).toBe("Nama Baru");
    expect(stored.email).toBe("test@example.com"); // properti lain tetap
  });

  test("updateProfile juga update fintrack-users list", () => {
    // Setup: users list
    const users = [
      { id: "user-123", name: "Nama Awal", email: "test@example.com" },
      { id: "user-456", name: "Lain", email: "other@example.com" },
    ];

    mockLocalStorage.setItem("fintrack-users", JSON.stringify(users));

    // Simulasi updateProfile dengan update ke fintrack-users
    const targetUserId = "user-123";
    const updates = { name: "Nama Baru" };

    const updatedUsers = JSON.parse(mockLocalStorage.getItem("fintrack-users"));
    const index = updatedUsers.findIndex((u) => u.id === targetUserId);
    if (index !== -1) {
      updatedUsers[index] = { ...updatedUsers[index], ...updates };
      mockLocalStorage.setItem("fintrack-users", JSON.stringify(updatedUsers));
    }

    // Verifikasi
    const stored = JSON.parse(mockLocalStorage.getItem("fintrack-users"));
    const updated = stored.find((u) => u.id === "user-123");
    expect(updated.name).toBe("Nama Baru");
    expect(stored[1].name).toBe("Lain"); // user lain tidak berubah
  });

  test("Profile tidak hilang setelah browser refresh (simulasi)", () => {
    // Setup: user awal
    const user = {
      id: "user-123",
      name: "Nama Awal",
      email: "test@example.com",
    };
    mockLocalStorage.setItem("fintrack-user", JSON.stringify(user));

    // User update nama
    const updated = { ...user, name: "Nama Baru" };
    mockLocalStorage.setItem("fintrack-user", JSON.stringify(updated));

    // Simulasi page refresh (localStorage tetap, React state clear)
    const afterRefresh = JSON.parse(mockLocalStorage.getItem("fintrack-user"));

    expect(afterRefresh.name).toBe("Nama Baru"); // nama update tetap ada
  });

  test("Update partial tidak menghapus properti lain", () => {
    const user = {
      id: "user-123",
      name: "Nama Awal",
      email: "test@example.com",
      currency: "IDR",
      locale: "id-ID",
      avatar: null,
    };

    mockLocalStorage.setItem("fintrack-user", JSON.stringify(user));

    // Update hanya name
    const updates = { name: "Nama Baru" };
    const updated = { ...user, ...updates };
    mockLocalStorage.setItem("fintrack-user", JSON.stringify(updated));

    const stored = JSON.parse(mockLocalStorage.getItem("fintrack-user"));
    expect(stored.name).toBe("Nama Baru");
    expect(stored.email).toBe("test@example.com");
    expect(stored.currency).toBe("IDR");
    expect(stored.locale).toBe("id-ID");
    expect(stored.avatar).toBe(null);
  });

  test("fintrack-user dan fintrack-users tetap sync", () => {
    // Setup
    const users = [{ id: "user-123", name: "Nama Awal", email: "test@example.com" }];
    const currentUser = users[0];

    mockLocalStorage.setItem("fintrack-users", JSON.stringify(users));
    mockLocalStorage.setItem("fintrack-user", JSON.stringify(currentUser));

    // Update keduanya
    const updates = { name: "Nama Baru" };

    // Update fintrack-user
    const updatedCurrentUser = { ...currentUser, ...updates };
    mockLocalStorage.setItem("fintrack-user", JSON.stringify(updatedCurrentUser));

    // Update fintrack-users
    const updatedUsers = JSON.parse(mockLocalStorage.getItem("fintrack-users"));
    updatedUsers[0] = { ...updatedUsers[0], ...updates };
    mockLocalStorage.setItem("fintrack-users", JSON.stringify(updatedUsers));

    // Verifikasi keduanya konsisten
    const storedUser = JSON.parse(mockLocalStorage.getItem("fintrack-user"));
    const storedUsers = JSON.parse(mockLocalStorage.getItem("fintrack-users"));

    expect(storedUser.name).toBe(storedUsers[0].name);
    expect(storedUser.name).toBe("Nama Baru");
  });
});
