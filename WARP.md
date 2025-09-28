# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a modern Minesweeper game built with React 18, TypeScript, and Vite. The project implements classic Minesweeper gameplay with three difficulty levels, a timer, mine counter, and responsive design.

## Development Commands

### Setup and Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
# Opens development server at http://localhost:5173
```

### Build and Production
```bash
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

### Code Quality
```bash
# Run ESLint with TypeScript support
npm run lint
```

### Testing
*Note: This project currently has no test framework configured. Consider adding testing with Vitest for unit tests and React Testing Library for component testing.*

## Architecture Overview

### Component Hierarchy
The application follows a clean component hierarchy:
- `App` → `Game` → `GameStatus` + `Board` → `Cell[]`

### State Management Pattern
The project uses a custom hook pattern for state management:
- **`useMinesweeper`**: Central game state hook that manages all game logic, board state, timer, and user interactions
- **React's built-in state**: Component-level state for UI concerns

### Core Game Logic Layer
All game mechanics are isolated in `utils/gameLogic.ts`:
- **Board creation and initialization**: `createEmptyBoard`, `placeMines`, `calculateNeighborMines`
- **Player actions**: `revealCell`, `toggleFlag`
- **Game state evaluation**: `checkGameState`, `getMinesLeft`, `revealAllMines`

### Type System
Comprehensive TypeScript definitions in `types/index.ts`:
- **Enums**: `CellState`, `GameState`, `Difficulty` 
- **Core interfaces**: `Cell`, `GameConfig`, `GameStats`
- **Difficulty configuration**: Pre-defined configs for Easy/Medium/Hard modes

### Key Architectural Patterns

1. **First-click safety**: Mines are placed after the first cell click, ensuring the first click is never a mine
2. **Immutable updates**: All board operations return new board instances rather than mutating state
3. **Recursive flood-fill**: Empty cell revelation uses recursive logic to reveal connected areas
4. **Pure function game logic**: Core game operations are pure functions that can be easily tested

### File Structure Logic
```
src/
├── components/     # React UI components
├── hooks/         # Custom React hooks for game state
├── types/         # TypeScript type definitions and enums
├── utils/         # Pure game logic functions
├── App.tsx        # Root component
└── main.tsx       # Application entry point
```

### Timer Implementation
The timer uses React's `useEffect` with `setInterval` and tracks elapsed seconds from game start. The timer automatically stops when the game ends (win/lose state).

### Board Rendering Strategy
The board component dynamically sets CSS Grid dimensions based on the current difficulty configuration, allowing for flexible board sizes without hardcoded layouts.

## Development Notes

### Game State Flow
1. **NOT_STARTED** → First cell click → **PLAYING**
2. **PLAYING** → Win condition met → **WON**
3. **PLAYING** → Mine clicked → **LOST**

### Mine Placement Logic
- Mines are never placed on the first clicked cell or its 8 neighbors
- Uses Fisher-Yates shuffle algorithm for random mine placement
- Supports custom difficulty configurations

### Cell Interaction Patterns
- **Left-click**: Reveals cell (disabled if already revealed)
- **Right-click**: Toggles flag (prevented with `e.preventDefault()`)
- **Context menu**: Disabled via `onContextMenu` handler

### CSS Grid for Board Layout
The board uses CSS Grid with dynamic template columns/rows set via inline styles based on board dimensions.

### Performance Considerations
- Board operations create new arrays/objects for immutability
- Consider using `React.memo` for Cell components if performance issues arise with large boards
- Timer updates every second using `setInterval`

## Common Workflow Patterns

### Adding New Difficulty Level
1. Add new enum value to `Difficulty` in `types/index.ts`
2. Add configuration to `DIFFICULTY_CONFIGS`
3. Update UI in `GameStatus` component

### Modifying Game Rules
- Core game logic is centralized in `utils/gameLogic.ts`
- Game state evaluation happens in `checkGameState` function
- Win/lose conditions can be modified there

### Styling Changes
- Main styles are in `App.css`
- Component-specific styles use CSS classes with BEM-like naming
- Board uses CSS Grid with dynamic sizing