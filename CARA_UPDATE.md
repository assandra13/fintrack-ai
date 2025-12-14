# 🔄 Panduan Update Aplikasi ke GitHub & Vercel

## 📋 Workflow Lengkap

Setiap kali Anda **tambah fitur**, **hapus fitur**, atau **perbaiki bug**, ikuti langkah berikut:

---

## 🚀 Langkah-Langkah Update

### **1. Edit Kode di Lokal**

Edit file yang ingin diubah di folder `E:\fintrack-ai`

Contoh:
- Tambah fitur baru
- Hapus fitur lama
- Perbaiki bug
- Update styling
- dll

---

### **2. Test Lokal**

**WAJIB test dulu sebelum push!**

```bash
# Jalankan development server
npm run dev

# Buka browser
http://localhost:3000

# Test semua perubahan
# Pastikan tidak ada error
```

---

### **3. Commit Perubahan**

```bash
# Cek status file yang berubah
git status

# Tambahkan semua perubahan
git add .

# Commit dengan pesan yang jelas
git commit -m "Deskripsi perubahan yang dibuat"
```

**Contoh pesan commit yang baik:**
```bash
git commit -m "Tambah fitur export PDF di halaman Reports"
git commit -m "Perbaiki bug sorting transaksi"
git commit -m "Update styling dashboard"
git commit -m "Hapus fitur recurring bills"
```

**Contoh pesan commit yang BURUK:**
```bash
git commit -m "update"           # ❌ Tidak jelas
git commit -m "fix"              # ❌ Tidak spesifik
git commit -m "changes"          # ❌ Tidak informatif
```

---

### **4. Push ke GitHub**

```bash
# Push ke branch main
git push origin main
```

**Output yang muncul:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Delta compression using up to X threads
Compressing objects: 100% (X/X), done.
Writing objects: 100% (X/X), X.XX KiB | X.XX MiB/s, done.
Total X (delta X), reused X (delta X)
To https://github.com/assandra13/fintrack-ai.git
   abc1234..def5678  main -> main
```

---

### **5. Vercel Auto-Deploy** ✨

**Otomatis terjadi setelah push!**

1. Vercel detect perubahan di GitHub
2. Vercel pull kode terbaru
3. Vercel build ulang (`npm run build`)
4. Vercel deploy hasil build
5. **Aplikasi di web sudah update!** (1-2 menit)

**Cek status deploy:**
1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klik project **fintrack-ai**
3. Tab **Deployments**
4. Lihat status:
   - 🟡 **Building** → Sedang build
   - ✅ **Ready** → Deploy berhasil
   - ❌ **Error** → Ada masalah (cek logs)

---

## 📊 Diagram Workflow

```
┌─────────────────────┐
│   1. Edit Kode      │
│   (Lokal)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   2. Test Lokal     │
│   npm run dev       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   3. Commit         │
│   git commit        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   4. Push GitHub    │
│   git push          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   5. Vercel Deploy  │
│   (Otomatis)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   ✅ Web Update!    │
│   fintrack-ai.app   │
└─────────────────────┘
```

---

## 🎯 Contoh Lengkap

### **Scenario: Tambah Fitur Export PDF**

```bash
# 1. Edit kode
# - Buat file src/utils/exportPDF.js
# - Update src/pages/Reports.jsx
# - Tambah button "Export PDF"

# 2. Test lokal
npm run dev
# Buka http://localhost:3000/reports
# Test button Export PDF
# Pastikan PDF tergenerate dengan benar

# 3. Commit
git add .
git commit -m "Tambah fitur export PDF di halaman Reports"

# 4. Push
git push origin main

# 5. Tunggu 1-2 menit
# Buka https://fintrack-ai-eosin.vercel.app/reports
# Fitur Export PDF sudah tersedia!
```

---

## ⚠️ Troubleshooting

### **Problem: Deployment Failed**

**Penyebab:**
- Build error (syntax error, missing dependencies)
- Environment variables tidak diset

**Solusi:**
```bash
# 1. Cek error di Vercel Dashboard → Deployments → View Logs

# 2. Test build lokal
npm run build
# Jika ada error, fix dulu

# 3. Push lagi
git add .
git commit -m "Fix build error"
git push origin main
```

---

### **Problem: Perubahan Tidak Muncul di Web**

**Penyebab:**
- Browser cache

**Solusi:**
```bash
# Hard refresh browser
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# Atau buka di incognito/private mode
```

---

### **Problem: Git Push Rejected**

**Penyebab:**
- Ada perubahan di GitHub yang belum di-pull

**Solusi:**
```bash
# Pull dulu
git pull origin main

# Resolve conflicts jika ada

# Push lagi
git push origin main
```

---

## 📝 Cheat Sheet

```bash
# Cek status
git status

# Tambah semua perubahan
git add .

# Commit
git commit -m "Deskripsi perubahan"

# Push
git push origin main

# Pull (ambil perubahan dari GitHub)
git pull origin main

# Cek branch
git branch

# Lihat history commit
git log --oneline
```

---

## ✅ Checklist Sebelum Push

- [ ] Kode sudah di-test lokal (`npm run dev`)
- [ ] Tidak ada error di console browser
- [ ] Build berhasil (`npm run build`)
- [ ] Commit message jelas dan deskriptif
- [ ] File `.env` tidak ter-commit (sudah di-gitignore)

---

## 🎉 Tips Pro

### **1. Commit Sering**
Jangan tunggu banyak perubahan. Commit setiap selesai 1 fitur kecil.

```bash
# ✅ Good
git commit -m "Tambah button delete di Transactions"
git commit -m "Tambah konfirmasi sebelum delete"
git commit -m "Update styling button delete"

# ❌ Bad
git commit -m "Update banyak hal"  # Terlalu general
```

### **2. Test Sebelum Push**
**SELALU** test lokal sebelum push. Jangan push kode yang error!

### **3. Pull Sebelum Edit**
Jika kerja dari multiple device, selalu pull dulu:
```bash
git pull origin main
# Baru edit kode
```

### **4. Gunakan Branch untuk Fitur Besar**
```bash
# Buat branch baru
git checkout -b feature-export-pdf

# Edit, commit, push ke branch
git push origin feature-export-pdf

# Merge ke main setelah selesai
git checkout main
git merge feature-export-pdf
git push origin main
```

---

## 🚀 Kesimpulan

**Workflow Singkat:**
```bash
npm run dev          # Test lokal
git add .            # Tambah perubahan
git commit -m "..."  # Commit
git push origin main # Push ke GitHub
# Vercel auto-deploy! ✨
```

**Tidak perlu:**
- ❌ Upload manual ke Vercel
- ❌ Build manual di Vercel
- ❌ Konfigurasi ulang

**Cukup:**
- ✅ Push ke GitHub
- ✅ Tunggu 1-2 menit
- ✅ Web sudah update!

---

**Happy Coding! 🎉**
