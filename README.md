# 🏦 Surbhi Telcom Dashboard

> **Authorized Customer Registration Portal — Union Bank of India**

A modern, professional banking-style web application for managing customer registrations, built with React + Vite + Tailwind CSS.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

App runs at: `http://localhost:5173/`

---

## 🌐 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Dashboard + Registration Form | Public |
| `/records` | Customer Records | Public |
| `/uploads` | Document Uploads | Public |
| `/admin-login` | Admin Login | Hidden |
| `/admin` | Admin Panel | Admin only |

---

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `!unionopen0` |

> Admin panel is **not linked** from the main navigation to keep it hidden. Access it by clicking the subtle **Admin** button in the navbar, or navigating directly to `/admin-login`.

---

## ✨ Features

### Dashboard (/)
- Hero section with Union Bank branding
- Live stats cards (total customers, today's entries, uploads)
- Full customer registration form with:
  - Field validation with error messages
  - File upload with preview (Photo + Signature)
  - Loading animation on submit
  - Success toast notification
  - **New Protection**: Input validation for Aadhar (12 digits) and Mobile (10 digits)

### Records (/records)
- Search across name, ID, account number, Aadhar, mobile
- Paginated table (10 rows/page)
- Click any row to open a slide-in detail panel with photo
- **Note**: Individual data delete is restricted to the Admin Panel for security.

### Uploads (/uploads)
- Drag-and-drop file upload
- Supports multiple file types (PDF, JPG, PNG, etc.)
- File list with size, date, and type icons
- Delete files individually

### Admin Panel (/admin)
- Protected route (redirects to login if not authenticated)
- Stats overview
- Full data table with all fields including photo preview
- Search + filter by account opening date
- Edit any record via modal form
- Delete records
- **Export to Excel (.xlsx)** with one click
- Secure session-based login

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#003A8F` |
| Accent Red | `#E31E24` |
| Gold Accent | `#FFD700` |
| Background | `#F0F4FF` |
| Font | Poppins + Inter (Google Fonts) |

**Effects used:**
- Glassmorphism cards (backdrop-filter blur)
- Neumorphism inputs (inset shadows)
- 3D stat cards with gradient overlay
- Smooth CSS animations (fadeInUp, float, slideLeft)
- Hover lift transforms
- Sticky gradient navbar

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx     # Global state (records, uploads, admin auth)
├── components/
│   ├── Navbar.jsx          # Sticky top navigation
│   ├── Footer.jsx          # Footer with designer credit
│   ├── StatsCards.jsx      # Animated stats overview
│   ├── CustomerForm.jsx    # Registration form with validation
│   └── FileSection.jsx     # Drag-and-drop file manager
├── pages/
│   ├── Dashboard.jsx       # Hero + stats + form layout
│   ├── Records.jsx         # Customer records table
│   ├── Uploads.jsx         # Document management
│   ├── AdminLogin.jsx      # Admin authentication
│   └── AdminPanel.jsx      # Full admin control panel
├── App.jsx                 # Router + Toaster setup
├── main.jsx                # Entry point
└── index.css               # Design system + custom CSS
```

---

## 💾 Data Storage

All data is stored in **localStorage** (persists across page refreshes in the same browser).

- Records: `st_records`
- Uploads: `st_uploads`  
- Admin session: `sessionStorage` key `st_admin`

---

## 🛠 Tech Stack

- **React 19** + Vite 6
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router v7** (client-side routing)
- **react-hot-toast** (notifications)
- **xlsx + file-saver** (Excel export)
- **lucide-react** (icons)

---

*Web Designer: **Harsh Aryan***
