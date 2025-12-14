# FinTrack AI - Financial Tracker Web Application

![FinTrack AI](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

**FinTrack AI** adalah aplikasi web pelacak keuangan yang lengkap dan profesional. Dibangun dengan React + Vite, aplikasi ini menyediakan solusi comprehensive untuk mengelola keuangan pribadi dengan antarmuka yang modern dan user-friendly.

## ✨ Features

### 🔐 Authentication
- Login & Register dengan validasi
- Forgot Password flow
- Session management dengan localStorage
- Protected routes

### 📊 Dashboard
- Ringkasan saldo total dari semua wallet
- Total pemasukan & pengeluaran bulan ini
- Perbandingan dengan bulan lalu
- Grafik Pie Chart untuk pengeluaran per kategori
- Daftar transaksi terbaru
- Alert system untuk tagihan yang akan jatuh tempo

### 💰 Transaction Management
- Full CRUD operations (Create, Read, Update, Delete)
- Search dan filter transaksi
- Kategori dan wallet selection
- Date picker untuk tanggal transaksi
- Income/Expense tracking

### 👛 Multi-Wallet Support
- Manajemen multiple wallets
- Transfer antar wallet
- Icon dan color customization
- Total balance calculation

### 🏷️ Category Management
- Default categories (protected)
- Custom categories dengan CRUD
- Income/Expense separation
- Icon dan color picker

### 📈 Budget Tracking
- Budget per category
- Progress tracking dengan visual indicators
- Over-budget alerts
- Period-based budgets (weekly/monthly/yearly)

### 🎯 Savings Goals
- Goal creation dengan deadline
- Progress tracking
- Fund allocation
- Completion detection
- Days remaining counter

### 📅 Bills Management
- Bill tracking dengan due dates
- Status tracking (overdue, due-soon, upcoming, paid)
- Mark as paid functionality
- Recurring bills support
- Reminder system

### 📊 Reports & Analytics
- Period selection (weekly/monthly/yearly)
- Trend charts (Line chart)
- Category breakdown (Pie chart)
- Automatic insights generation
- Savings rate calculation
- Export functionality (CSV/JSON)

### ⚙️ Settings
- Profile management
- Dark/Light mode toggle
- Data export (JSON)
- Data import (JSON)
- Clear all data with confirmation

### 🎨 Design & UX
- Modern UI dengan glassmorphism
- Dark mode / Light mode
- Smooth animations dan transitions
- Responsive layout
- Toast notifications
- Empty states
- Loading states

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Vanilla CSS dengan CSS Variables
- **State Management**: Context API
- **Data Persistence**: localStorage
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd fintrack-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## 🏗️ Project Structure

```
fintrack-ai/
├── src/
│   ├── components/
│   │   └── common/          # Reusable components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Select.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       └── EmptyState.jsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── DataContext.jsx
│   │   └── NotificationContext.jsx
│   ├── data/                # Static data
│   │   ├── defaultCategories.js
│   │   ├── colors.js
│   │   └── icons.js
│   ├── pages/               # Page components
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
│   ├── utils/               # Utility functions
│   │   ├── formatters.js
│   │   ├── calculations.js
│   │   ├── validators.js
│   │   ├── exportData.js
│   │   └── importData.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & design system
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Usage

### First Time Setup

1. **Register Account**
   - Navigate to `/register`
   - Fill in your details
   - Click "Daftar"

2. **Login**
   - Use your registered email and password
   - Click "Masuk"

3. **Setup Wallets**
   - Go to "Wallets" page
   - Add your wallets (Cash, Bank, E-Wallet, etc.)
   - Customize icons and colors

4. **Add Categories** (Optional)
   - Go to "Categories" page
   - Add custom categories if needed
   - Default categories are already provided

5. **Start Tracking**
   - Add transactions from "Transactions" page
   - Set budgets in "Budgets" page
   - Create savings goals in "Goals" page
   - Track bills in "Bills" page

### Data Management

**Export Data**
- Go to Settings
- Click "Export" button
- JSON file will be downloaded

**Import Data**
- Go to Settings
- Click "Import" button
- Select previously exported JSON file
- Data will be merged with existing data

**Clear Data**
- Go to Settings
- Click "Clear All Data"
- Confirm the action
- All data will be deleted

## 🎨 Customization

### Theme
Toggle between Light and Dark mode using the theme switcher in the header.

### Colors & Icons
Customize wallet and category colors and icons through their respective management pages.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔒 Data Privacy

All data is stored locally in your browser's localStorage. No data is sent to any server. Your financial information stays on your device.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
npm run deploy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React + Vite

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)

---

**FinTrack AI** - Your Personal Finance Tracker 💰
