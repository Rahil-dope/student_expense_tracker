# Student Expense Tracker

A modern, feature-rich expense tracking application built specifically for students. Track your expenses, manage budgets, and gain insights into your spending habits with an intuitive and beautiful interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)

## ✨ Features

### Core Functionality
- **📊 Dashboard** - Overview of your financial status at a glance
- **💰 Expense Tracking** - Easy-to-use interface for adding income and expenses
- **📈 Analytics** - Visual charts and insights into spending patterns
- **💳 Budget Management** - Set and track monthly budgets
- **🔍 Smart Search & Filter** - Quickly find transactions by category, note, or date
- **📅 Transaction History** - Organized view of all your transactions

### Data Management
- **💾 Local Storage** - All data persists locally in your browser
- **📤 Export Data** - Download your data as JSON for backup
- **📥 Import Data** - Restore from previously exported backups
- **🔄 Auto-Save** - Changes are automatically saved

### User Experience
- **✅ Input Validation** - Comprehensive validation with helpful error messages
- **🎨 Modern UI** - Clean, professional design with smooth animations
- **📱 Responsive** - Works perfectly on desktop, tablet, and mobile
- **⚡ PWA Support** - Installable as a mobile app with offline capabilities
- **♿ Accessible** - Follows accessibility best practices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Mobile Setup

1. **Clone or download the repository**
   ```bash
   cd path/to/S_E_T_UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Install on Mobile (PWA)**
   - Access the app via your network IP (e.g., `http://192.168.1.x:3000`)
   - **Android:** Tap Chrome menu (⋮) -> "Add to Home Screen" / "Install App"
   - **iOS:** Tap Share button -> "Add to Home Screen"
   - The app will install and look like a native app!

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `build` folder.

## 🚀 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

1.  Push your code to a GitHub repository.
2.  Log in to Vercel and click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  Vercel will automatically detect **Vite**.
5.  Ensure the **Output Directory** is set to `dist` (default).
6.  Click **Deploy**.

The `vercel.json` file ensures that routing works correctly for this Single Page Application.

## 📖 Usage Guide

### First Time Setup

1. **Onboarding** - Click "Get Started" on the welcome screen
2. **Set Your Budget** - Navigate to Budgets and set your monthly budget
3. **Start Tracking** - Use the + button to add your first transaction

### Adding Transactions

1. Click the **+** floating button on the dashboard
2. Select transaction type (Expense/Income)
3. Enter the amount (required)
4. Choose a category (for expenses)
5. Select the date (cannot be in the future)
6. Add an optional note
7. Click "Save Transaction"

**Validation Rules:**
- Amount must be greater than 0 and less than 1,000,000
- Date cannot be in the future
- All required fields must be filled

### Viewing Transactions

- **Dashboard**: Shows recent transactions
- **Transactions Screen**: View all transactions with search and filter options
- **Search**: Type to search by note or category
- **Filter**: Click filter button to filter by category

### Managing Budget

1. Go to **Budgets** screen
2. Click "Edit Budget"
3. Enter your monthly budget
4. Click ✓ to save

The dashboard will show:
- Total spent this month
- Remaining budget
- Budget progress bar

### Exporting/Importing Data

**To Export:**
1. Go to Settings
2. Click "Export Data"
3. JSON file will be downloaded

**To Import:**
1. Go to Settings
2. Click "Import Data"
3. Select your backup JSON file
4. Confirm the import

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: Tailwind CSS utilities

## 📂 Project Structure

```
S_E_T_UI/
├── src/
│   ├── components/          # React components
│   │   ├── AddExpenseScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── BudgetsScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CategoryChip.tsx
│   │   └── Input.tsx
│   ├── utils/               # Utility functions
│   │   └── storage.ts       # localStorage utilities
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 💾 Data Structure

### Transaction Object
```typescript
{
  id: string;           // Unique identifier
  amount: number;       // Transaction amount
  category: string;     // Category name
  note: string;         // Optional description
  date: string;         // ISO date string
  type: 'expense' | 'income';  // Transaction type
}
```

### Settings Object
```typescript
{
  darkMode: boolean;       // Dark mode preference
  biometricLock: boolean;  // Security setting
  currency: string;        // Currency code (default: 'INR')
}
```

## 🔒 Privacy & Security

- **100% Local** - All data is stored locally in your browser
- **No Tracking** - We don't collect any personal information
- **No Server** - No data is sent to external servers
- **Your Data, Your Control** - Export/import/delete anytime

## 🐛 Known Issues & Limitations

- Data is stored in browser localStorage (cleared if browser data is cleared)
- No multi-device sync (use export/import for data transfer)
- Limited to ~5MB of data (browser localStorage limit)

## 🔮 Upcoming Features

- 🌙 Dark Mode
- 📊 Advanced Analytics
- 🔄 Recurring Transactions
- 📱 Progressive Web App (PWA)
- 📂 Custom Categories
- 🎯 Category-wise Budgets

## 🤝 Contributing

This is a student project. Contributions, issues, and feature requests are welcome!

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Developer

Made with ❤️ by students, for students

## 📞 Support

If you encounter any issues or have questions:
1. Check this README
2. Review the data structure documentation above
3. Ensure localStorage is enabled in your browser
4. Try exporting and reimporting your data

## 🙏 Acknowledgments

- UI Design inspired by modern fintech applications
- Icons provided by Lucide React
- Charts powered by Recharts
- Component library by Radix UI

---

**Happy Expense Tracking! 💰📊**