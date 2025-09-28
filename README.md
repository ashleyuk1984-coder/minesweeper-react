# 💣 Minesweeper React

A modern, responsive Minesweeper game built with React and TypeScript. Features three difficulty levels, timer, mine counter, and a clean, intuitive interface.

## Features

- **Three Difficulty Levels**: Easy (9×9, 10 mines), Medium (16×16, 40 mines), Hard (16×30, 99 mines)
- **Game Timer**: Tracks elapsed time during gameplay
- **Mine Counter**: Shows remaining mines (total mines minus flagged cells)
- **Flag System**: Right-click to flag suspected mines
- **Auto-reveal**: Empty cells automatically reveal adjacent cells
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean design with smooth animations and hover effects

## How to Play

1. **Left-click** on a cell to reveal it
2. **Right-click** on a cell to flag/unflag it
3. Numbers show how many mines are adjacent to that cell
4. Flag all mines and reveal all safe cells to win
5. Click on a mine to lose the game
6. Use the smiley button to start a new game

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

Build the app for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Cell.tsx        # Individual cell component
│   ├── Board.tsx       # Game board component
│   ├── Game.tsx        # Main game component
│   └── GameStatus.tsx  # Status display component
├── hooks/              # Custom React hooks
│   └── useMinesweeper.ts # Game state management hook
├── types/              # TypeScript type definitions
│   └── index.ts        # Game types and enums
├── utils/              # Utility functions
│   └── gameLogic.ts    # Core game logic
├── App.tsx             # Main app component
├── App.css             # Styles
└── main.tsx           # App entry point
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling with flexbox and grid
- **ESLint** - Code linting

## Game Logic

The game implements classic Minesweeper rules:

- First click is always safe (mines are placed after the first click)
- Empty cells (0 adjacent mines) automatically reveal neighboring cells
- Win condition: All non-mine cells revealed
- Lose condition: Mine cell clicked
- Flagging system helps track suspected mines

## Contributing

Feel free to contribute to this project! Areas for improvement:

- Sound effects
- High score tracking
- Custom difficulty settings
- Themes and visual customization
- Touch gestures for mobile

## License

This project is open source and available under the MIT License.