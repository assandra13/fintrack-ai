# 💰 FinTrack AI - Aplikasi Pelacak Keuangan

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://fintrack-ai-eosin.vercel.app)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

**FinTrack AI** adalah aplikasi web pelacak keuangan yang lengkap dan profesional. Dibangun dengan React + Vite + Supabase, aplikasi ini menyediakan solusi comprehensive untuk mengelola keuangan pribadi dengan antarmuka yang modern dan user-friendly.

🌐 **Live Demo:** [https://fintrack-ai-eosin.vercel.app](https://fintrack-ai-eosin.vercel.app)

---

## ✨ Fitur Utama

### 🔐 Autentikasi
- Login & Register dengan Supabase Auth
- Verifikasi email (opsional)
- Reset password
- Session management
- Protected routes
- Google OAuth (opsional)

### 📊 Dashboard
- Ringkasan saldo total dari semua wallet
- Total pemasukan & pengeluaran bulan ini
- Perbandingan dengan bulan lalu (%)
- Grafik Pie Chart untuk pengeluaran per kategori
- Daftar 5 transaksi terbaru
- Alert system untuk tagihan yang akan jatuh tempo

### 💰 Manajemen Transaksi
- CRUD lengkap (Create, Read, Update, Delete)
- Pencarian dan filter transaksi
- Kategori dan wallet selection
- Date picker untuk tanggal transaksi
- Pelacakan pemasukan/pengeluaran
- Tag management
- Upload lampiran/struk
- Transaksi berulang (recurring)

### 👛 Multi-Wallet
- Manajemen multiple wallets (Cash, Bank, E-Wallet, dll)
- Transfer antar wallet
- Kustomisasi icon dan warna
- Kalkulasi total balance otomatis

### 🏷️ Manajemen Kategori
- Kategori default (protected)
- Kategori custom dengan CRUD
- Pemisahan Income/Expense
- Icon dan color picker
- Sub-kategori support

### 📈 Budget Tracking
- Budget per kategori
- Progress tracking dengan visual indicators
- Alert over-budget
- Period-based budgets (mingguan/bulanan/tahunan)

### 🎯 Savings Goals
- Pembuatan goal dengan deadline
- Progress tracking
- Alokasi dana
- Deteksi completion
- Counter hari tersisa

### 📅 Manajemen Tagihan
- Pelacakan tagihan dengan due dates
- Status tracking (overdue, due-soon, upcoming, paid)
- Mark as paid functionality
- Recurring bills support
- Sistem reminder

### 📊 Laporan & Analitik
- Pemilihan periode (mingguan/bulanan/tahunan)
- Trend charts (Line chart)
- Category breakdown (Pie chart)
- Automatic insights generation
- Kalkulasi savings rate
- Export functionality (CSV/JSON)

### ⚙️ Pengaturan
- Manajemen profil
- Dark/Light mode toggle
- Export data (JSON)
- Import data (JSON)
- Clear all data dengan konfirmasi

### 🎨 Design & UX
- Modern UI dengan glassmorphism
- Dark mode / Light mode
- Smooth animations dan transitions
- Responsive layout (Mobile, Tablet, Desktop)
- Toast notifications
- Empty states
- Loading states
- PWA ready (bisa install di home screen HP)

---

## 🚀 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Backend & Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Routing** | React Router DOM v6 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS dengan CSS Variables |
| **State Management** | Context API |
| **Data Persistence** | Supabase + localStorage fallback |
| **Date Handling** | date-fns |
| **Deployment** | Vercel |

---

## 📦 Instalasi

### Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Supabase (gratis)

### Langkah-langkah

#### 1. Clone Repository
```bash
git clone https://github.com/assandra13/fintrack-ai.git
cd fintrack-ai
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Environment Variables

Buat file `.env` di root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Cara mendapatkan kredensial:**
1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Pergi ke **Settings** → **API**
4. Copy **Project URL** dan **anon public** key

#### 4. Setup Database

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `supabase-schema.sql`
3. Paste dan Execute
4. Database siap digunakan!

#### 5. Jalankan Development Server
```bash
npm run dev
```

#### 6. Buka Browser
```
http://localhost:3000
```

---

## 🗄️ Database Setup

### Opsi 1: Gunakan Supabase (Recommended)

**Keuntungan:**
- ✅ Data sync antar device
- ✅ Backup otomatis
- ✅ Akses dari mana saja
- ✅ Gratis untuk personal use

**Setup:**
1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Jalankan SQL dari `supabase-schema.sql`
4. Copy kredensial ke `.env`

### Opsi 2: Offline Mode

**Keuntungan:**
- ✅ Tidak perlu internet
- ✅ Setup cepat

**Kekurangan:**
- ❌ Data tidak sync antar device
- ❌ Data hilang jika clear browser

**Setup:**
- Kosongkan file `.env` atau jangan buat
- Aplikasi otomatis pakai localStorage

---

## 🏗️ Struktur Project

```
fintrack-ai/
├── src/
│   ├── components/
│   │   └── common/          # Komponen reusable
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── ModernModal.jsx
│   │       ├── ModernSelect.jsx
│   │       ├── ModernDatePicker.jsx
│   │       ├── NumberInput.jsx
│   │       ├── Select.jsx
│   │       ├── Sidebar.jsx
│   │       ├── BottomNav.jsx
│   │       ├── Header.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ConfirmationModal.jsx
│   │       ├── TagManager.jsx
│   │       ├── AttachmentUpload.jsx
│   │       └── QuickAddTransaction.jsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── DataContext.jsx
│   │   └── NotificationContext.jsx
│   ├── data/                # Data statis
│   │   ├── defaultCategories.js
│   │   ├── colors.js
│   │   └── icons.js
│   ├── lib/                 # Integrasi eksternal
│   │   ├── supabase.js
│   │   └── supabaseSync.js
│   ├── pages/               # Komponen halaman
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Wallets.jsx
│   │   ├── Categories.jsx
│   │   ├── Budgets.jsx
│   │   ├── Goals.jsx
│   │   ├── Bills.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── utils/               # Fungsi utility
│   │   ├── formatters.js
│   │   ├── calculations.js
│   │   ├── validators.js
│   │   ├── exportData.js
│   │   └── importData.js
│   ├── App.jsx              # Komponen utama
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & design system
├── public/
│   └── favicon.svg          # Favicon
├── supabase-schema.sql      # Database schema
├── .env.example             # Template environment
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🎯 Cara Penggunaan

### Setup Awal

#### 1. Register Akun
- Buka `/register`
- Isi nama, email, dan password
- Klik "Daftar"

#### 2. Login
- Gunakan email dan password yang sudah didaftarkan
- Klik "Masuk"

#### 3. Setup Wallets
- Pergi ke halaman "Wallet"
- Tambah wallet (Cash, Bank, E-Wallet, dll)
- Kustomisasi icon dan warna

#### 4. Tambah Kategori (Opsional)
- Pergi ke halaman "Kategori"
- Tambah kategori custom jika diperlukan
- Kategori default sudah tersedia

#### 5. Mulai Tracking
- Tambah transaksi dari halaman "Transaksi"
- Set budget di halaman "Budget"
- Buat savings goals di halaman "Goals"
- Track tagihan di halaman "Tagihan"

### Manajemen Data

#### Export Data
1. Pergi ke Settings
2. Klik tombol "Export"
3. File JSON akan terdownload

#### Import Data
1. Pergi ke Settings
2. Klik tombol "Import"
3. Pilih file JSON yang sudah di-export sebelumnya
4. Data akan di-merge dengan data yang ada

#### Clear Data
1. Pergi ke Settings
2. Klik "Clear All Data"
3. Konfirmasi aksi
4. Semua data akan terhapus

---

## 🎨 Kustomisasi

### Theme
Toggle antara Light dan Dark mode menggunakan theme switcher di header.

### Warna & Icon
Kustomisasi warna dan icon wallet/kategori melalui halaman manajemen masing-masing.

---

## 📱 Responsive Design

Aplikasi fully responsive dan bekerja di:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (< 768px)

### Install sebagai PWA (Progressive Web App)
1. Buka aplikasi di browser mobile (Chrome/Safari)
2. Tap menu (⋮)
3. Pilih **"Add to Home Screen"**
4. Icon muncul di home screen
5. Buka seperti aplikasi native!

---

## 🔒 Privasi Data

### Cloud Mode (Default)
- Data disimpan secara aman di Supabase (PostgreSQL)
- Enkripsi HTTPS untuk semua transmisi data
- Data hanya bisa diakses oleh Anda
- Backup otomatis

### Offline Mode
- Data disimpan di localStorage browser
- Data tidak dikirim ke server manapun
- Informasi keuangan tetap di device Anda

---

## 🚀 Deployment

### Build untuk Production
```bash
npm run build
```
Output akan ada di folder `dist/`.

### Deploy ke Vercel (Recommended)

#### 1. Push ke GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Import ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Sign up dengan GitHub
3. Klik "Add New Project"
4. Import repository `fintrack-ai`
5. Tambahkan Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Klik "Deploy"

#### 3. Update Supabase Settings
1. Buka Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. **Site URL:** `https://your-app.vercel.app`
4. **Redirect URLs:** `https://your-app.vercel.app/**`
5. Save

**Live Demo:** [https://fintrack-ai-eosin.vercel.app](https://fintrack-ai-eosin.vercel.app)

---

## 🔄 Update Aplikasi

### Workflow Update Fitur

```bash
# 1. Edit kode di lokal
# (Tambah fitur, hapus fitur, perbaiki bug, dll)

# 2. Test lokal
npm run dev

# 3. Commit perubahan
git add .
git commit -m "Deskripsi perubahan"

# 4. Push ke GitHub
git push origin main

# 5. Vercel otomatis deploy ulang (1-2 menit)
# Aplikasi di web sudah update!
```

**Tidak perlu upload manual ke Vercel!** Setiap push ke GitHub = auto-deploy.

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan submit Pull Request.

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License.

---

## 👨‍💻 Author

Dibuat dengan ❤️ menggunakan React + Vite + Supabase

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)
- [Vercel](https://vercel.com/)

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di GitHub repository.

---

**FinTrack AI - Kelola Keuangan Anda dengan Mudah** 💰✨
