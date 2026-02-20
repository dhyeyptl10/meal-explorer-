# 🍽 Meal Explorer App

An aesthetic, feature-rich Meal Explorer built with React, React Router, GSAP animations, and TheMealDB API.

---

## ✅ Features
- 🔍 Search meals by name
- 🔤 Filter by first letter (A–Z)
- 📋 View full meal details with ingredients
- ♥ Like/Unlike meals (saved in localStorage)
- 📦 Categories page with descriptions
- 🌙 Dark / ☀️ Light theme toggle
- ✨ GSAP animations throughout
- 📱 Fully responsive

---

## 🚀 Setup Instructions

### Step 1 — Install Node.js
Download from: https://nodejs.org (LTS version)

### Step 2 — Create Vite React Project
```bash
npm create vite@latest meal-explorer -- --template react
cd meal-explorer
```

### Step 3 — Install Dependencies
```bash
npm install react-router-dom gsap
```

### Step 4 — Replace Files
Copy ALL files from this project into your `meal-explorer` folder, replacing the defaults.

Your final folder structure:
```
meal-explorer/
├── index.html            ← replace
├── package.json          ← replace
├── vite.config.js        ← replace
└── src/
    ├── main.jsx           ← replace
    ├── App.jsx            ← replace
    ├── index.css          ← replace
    ├── context/
    │   ├── ThemeContext.jsx
    │   └── LikesContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   └── MealCard.jsx
    └── pages/
        ├── SearchPage.jsx
        ├── MealDetails.jsx
        ├── CategoriesPage.jsx
        └── LikedMeals.jsx
```

### Step 5 — Run the App
```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## 📁 Routes
| Path | Page |
|------|------|
| `/` | Search Meals |
| `/meal/:id` | Meal Details |
| `/liked` | Liked Meals |
| `/categories` | Categories |
