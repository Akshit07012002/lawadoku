# Lovedoku - A Romantic Surprise Proposal Web App 💕

A React web app that pretends to be a Sudoku game but secretly reveals a romantic marriage proposal! Built with React, Tailwind CSS, and Framer Motion.

## 🎯 Project Overview

This is a surprise proposal web app disguised as a Sudoku game. The flow is:

1. **Sudoku Game Screen** - Appears to be a normal Sudoku puzzle
2. **Fake Ad Screens** - Two humorous ad stages that gradually reveal the romantic nature
3. **Proposal Screen** - The big reveal with Accept/Reject buttons
4. **Success Screen** - Final celebration with the marriage proposal

## ✨ Features

- **Sudoku Grid**: Interactive 9x9 Sudoku board (auto-completes after 5 seconds)
- **Fake Ad System**: Two-stage ad system with humor and romance
- **Proposal Flow**: Accept/Reject buttons with funny rejection messages
- **Hearts Animation**: Beautiful floating hearts animation on acceptance
- **Easter Egg**: Press `Ctrl+L` for a secret message
- **Responsive Design**: Mobile-friendly with beautiful gradients and animations

## 🛠️ Tech Stack

- **React 18** - Functional components with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Vite** - Fast build tool and dev server

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lovedoku
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎮 How to Use

1. **Start the Game**: The Sudoku puzzle will appear automatically
2. **Wait for Completion**: The puzzle auto-completes after 5 seconds
3. **Watch the Ads**: Two ad stages will play automatically
4. **Make Your Choice**: Click Accept ❤️ or Reject 😢
5. **Enjoy the Animation**: Hearts will float if you accept!

## 🎨 Customization

### Changing the Title
Edit the title in `src/App.jsx`:
```jsx
<h1 className="text-5xl font-bold text-purple-600 mb-4">Lawanya's Sudoku Challenge</h1>
```

### Modifying the Timer
Change the auto-completion time in `src/App.jsx`:
```jsx
const timer = setTimeout(() => {
  setGameState('ad1')
}, 5000) // Change 5000 to your desired milliseconds
```

### Adding More Rejection Messages
Edit the messages array in `src/components/WinScreen.jsx`:
```jsx
const messages = [
  "Are you sure? Recompile answer.",
  "Error 404: Girlfriend not found",
  // Add your own messages here!
]
```

## 🎭 Easter Eggs

- **Ctrl+L**: Shows a secret message about being the solution to the puzzle
- **Rejection Loop**: Each rejection shows a different funny message
- **Hidden Hearts**: Various heart emojis in the floating animation

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 Styling

- **Color Scheme**: Purple, pink, and red gradients
- **Typography**: Playful and bold fonts
- **Animations**: Smooth transitions and hover effects
- **Shadows**: Modern shadow system for depth

## 🔧 Project Structure

```
src/
├── components/
│   ├── SudokuGrid.jsx      # Sudoku game board
│   ├── AdModal.jsx         # Ad stages modal
│   ├── WinScreen.jsx       # Proposal screen
│   └── HeartsAnimation.jsx # Floating hearts
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## 🚀 Deployment

The app can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure your domain and enjoy!

## 💝 Special Notes

This app is designed as a romantic surprise proposal. The Sudoku puzzle doesn't need to be solved - it's just a clever disguise to make the reveal more special!

## 📄 License

This project is created with love for a special someone. Feel free to use and modify for your own romantic surprises!

---

Made with ❤️ and React
