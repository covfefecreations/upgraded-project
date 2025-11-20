# Manjurat v1.0 - Architecture Documentation

## System Overview

Manjurat is a visual development workflow dashboard designed to provide real-time monitoring and management of software development lifecycle stages. The application employs a component-based architecture built on React with TypeScript, emphasizing modularity, maintainability, and visual sophistication.

## Architecture Principles

### 1. Component-Driven Design

- **Atomic Components**: Each UI element is a self-contained, reusable component
- **Composition Over Inheritance**: Complex UIs built by composing simple components
- **Single Responsibility**: Each component has one clear purpose

### 2. Unidirectional Data Flow

- State flows down through props
- Events bubble up through callbacks
- Context API used for cross-cutting concerns (theme)

### 3. Separation of Concerns

- **Presentation Layer**: React components (UI rendering)
- **State Management**: Context API and local component state
- **Business Logic**: Custom hooks (future: useWorkflowState, useMonitoring)
- **Styling**: Tailwind utility classes + scoped styles

-----

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                         (App.tsx)                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌────────▼────────┐
│ ThemeContext   │            │   Dashboard     │
│   Provider     │            │   Container     │
└───────┬────────┘            └────────┬────────┘
        │                              │
        │         ┌────────────────────┼────────────────────┐
        │         │                    │                    │
        │    ┌────▼─────┐      ┌──────▼──────┐     ┌──────▼──────┐
        │    │  Header  │      │ WorkflowNode │     │ HeartbeatDial│
        │    │Component │      │  Component   │     │  Component   │
        │    └──────────┘      └──────┬──────┘     └──────┬──────┘
        │                             │                    │
        │                      ┌──────▼──────┐     ┌──────▼──────┐
        └──────────────────────►ThemeToggle  │     │ConnectionLine│
                               │  Component  │     │  Component   │
                               └─────────────┘     └─────────────┘
```

-----

## Component Hierarchy

### Root Level

```
<ThemeContext.Provider>
  └── <Dashboard />
      ├── <Header />
      │   ├── Logo + Title
      │   ├── <ThemeToggle />
      │   └── <SearchButton />
      │
      └── <WorkflowCanvas />
          ├── <WorkflowNode stage="code" />
          ├── <WorkflowNode stage="qa" />
          ├── <WorkflowNode stage="plan" />
          ├── <HeartbeatDial />
          └── <ConnectionLine /> × N
```

-----

## Core Components

### 1. Dashboard Component

**File**: `Dashboard.tsx`  
**Responsibility**: Main application container and layout orchestration

**Key Features**:

- Theme state management
- Responsive layout grid
- Component positioning and spacing
- Global styling application

**Props**: None (root component)

**State**:

```typescript
{
  theme: 'light' | 'dark'
}
```

**Methods**:

- `toggleTheme()`: Switches between light and dark themes

-----

### 2. HeartbeatDial Component

**File**: `HeartbeatDial.tsx`  
**Responsibility**: Central monitoring visualization

**Architecture**:

```
┌──────────────────────────────┐
│   Outer Glow Layer (pulse)   │
│  ┌────────────────────────┐  │
│  │  Middle Ring (border)  │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Inner Core +    │  │  │
│  │  │  Heartbeat SVG   │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

**Visual Layers**:

1. **Outer Glow**: Animated radial gradient (220px diameter)
1. **Middle Ring**: Semi-transparent border (200px diameter)
1. **Inner Core**: Solid background with glassmorphism (160px diameter)
1. **Icon**: SVG heartbeat waveform

**Props**:

```typescript
interface HeartbeatDialProps {
  theme: Theme;
  status?: 'active' | 'warning' | 'error'; // Future enhancement
}
```

**Animations**:

- `heartbeat`: 2s ease-in-out infinite pulse
- Scale: 1.0 → 1.05 → 1.0
- Opacity: 0.8 → 1.0 → 0.8

-----

### 3. WorkflowNode Component

**File**: `WorkflowNode.tsx`  
**Responsibility**: Individual workflow stage representation

**Structure**:

```
┌─────────────────┐
│   Main Icon     │  ← 80×80px rounded square
└────────┬────────┘
         │
    ┌────▼────┐
    │  Label  │       ← Text label
    └────┬────┘
         │
    ┌────▼────┐
    │SubIcon 1│       ← Optional 32×32px squares
    ├─────────┤
    │SubIcon 2│
    └─────────┘
```

**Props**:

```typescript
interface WorkflowNodeProps {
  icon: string;           // Emoji or icon identifier
  label: string;          // Display name
  stage: WorkflowStage;   // 'code' | 'qa' | 'deploy' | 'plan'
  position: 'left' | 'right' | 'bottom';
  theme: Theme;
  subIcons?: string[];    // Optional sub-icons
  onClick?: () => void;   // Future: click handler
}
```

**Interaction States**:

- **Default**: Base styling with theme colors
- **Hover**: Glow effect (box-shadow expansion)
- **Active**: (Future) Highlighted border or background

**Positioning System**:

- Uses absolute positioning within parent container
- Coordinates defined in Dashboard component
- Responsive scaling (future enhancement)

-----

### 4. ConnectionLine Component

**File**: `ConnectionLine.tsx`  
**Responsibility**: Visual connections between nodes

**SVG Path Calculation**:

```typescript
// Quadratic Bezier curve
from: {x, y} → control: {midX, fromY} → to: {x, y}

Path Formula:
M start_x start_y Q control_x control_y end_x end_y
```

**Props**:

```typescript
interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  theme: Theme;
  animated?: boolean;  // Controls dot animation
}
```

**Animation**:

- Animated circle travels along SVG path
- Duration: 3s per cycle
- Infinite repeat

**Visual Effects**:

- Gaussian blur filter for glow
- Opacity: 0.6 (path), 0.8 (dot)
- Color matches theme accent

-----

### 5. Header Component

**File**: `Header.tsx` (embedded in Dashboard)  
**Responsibility**: Top navigation and controls

**Structure**:

```
┌────────────────────────────────────────────┐
│ [Logo] Manjurat          [Theme] [Search] │
└────────────────────────────────────────────┘
```

**Elements**:

- Logo: 📊 emoji + “Manjurat” text
- ThemeToggle: Sun/Moon icon button
- Search: Magnifying glass icon button

-----

### 6. ThemeContext

**File**: `ThemeContext.tsx` (embedded in Dashboard)  
**Responsibility**: Global theme state management

**Context Shape**:

```typescript
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
```

**Usage**:

```typescript
const { theme, toggleTheme } = useContext(ThemeContext);
```

**Benefits**:

- Avoids prop drilling
- Single source of truth for theme
- Easy theme switching across all components

-----

## Data Flow Architecture

### Theme Management Flow

```
User clicks ThemeToggle
         │
         ▼
toggleTheme() called
         │
         ▼
State update: theme = 'dark' | 'light'
         │
         ▼
Context value updated
         │
         ▼
All consuming components re-render
         │
         ▼
CSS classes and inline styles update
         │
         ▼
Visual theme change applied
```

### Component Interaction Flow (Future)

```
User clicks WorkflowNode
         │
         ▼
onClick handler triggered
         │
         ▼
Update workflow state (useWorkflowState)
         │
         ▼
State change propagates to:
  - HeartbeatDial (status update)
  - ConnectionLines (highlight active path)
  - Other WorkflowNodes (deactivate)
         │
         ▼
UI reflects new active stage
```

-----

## State Management Strategy

### Current (v1.0)

- **Local State**: `useState` for component-specific state
- **Context API**: ThemeContext for global theme
- **Props**: Direct parent-to-child data passing

### Future Scalability (v2.0+)

```typescript
// Proposed hook structure
const useWorkflowState = () => {
  const [activeStage, setActiveStage] = useState<WorkflowStage | null>(null);
  const [stageStatuses, setStageStatuses] = useState<StageStatusMap>({});
  const [connections, setConnections] = useState<ConnectionMap>({});
  
  return {
    activeStage,
    stageStatuses,
    connections,
    activateStage,
    updateStatus,
    resetWorkflow
  };
};
```

-----

## Styling Architecture

### Theme System

**Implementation**: CSS-in-JS via inline styles + Tailwind utilities

**Color Token Structure**:

```typescript
const themeColors = {
  light: {
    bgPrimary: '#E8DED3',
    bgSecondary: '#6B7E8F',
    cardBg: '#D4C8BD',
    accentTeal: '#4DB8A8',
    textPrimary: '#2C3E50',
    textSecondary: '#5A6C7D'
  },
  dark: {
    bgPrimary: '#1A1F2E',
    bgSecondary: '#2C3545',
    cardBg: '#252B3B',
    accentTeal: '#3DD9C1',
    accentGlow: '#4DB8FF',
    textPrimary: '#E0E6ED',
    textSecondary: '#9BA5B1'
  }
};
```

### Styling Layers

1. **Global**: Base typography, resets (Tailwind base)
1. **Theme**: Dynamic color application via ternary operators
1. **Component**: Scoped styles for animations and effects
1. **Utility**: Tailwind classes for layout and spacing

-----

## Animation System

### CSS Keyframe Animations

```css
@keyframes heartbeat {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 10px var(--accent-teal); }
  50% { box-shadow: 0 0 20px var(--accent-teal); }
}
```

### SVG Animations

- `<animateMotion>`: Circle traveling along path
- Duration: 3s, infinite repeat
- Path-based positioning

### Transition Strategy

- Duration: 300ms (fast UI feedback)
- Easing: ease-in-out (smooth, natural motion)
- Properties: colors, shadows, transforms

-----

## Performance Considerations

### Current Optimizations

- **SVG Efficiency**: Minimal path complexity
- **CSS Animations**: Hardware-accelerated (transform, opacity)
- **Conditional Rendering**: Theme-based class application
- **Event Throttling**: (Future) Debounce hover effects

### Scalability Concerns

- **Multiple ConnectionLines**: Consider canvas rendering for 10+ lines
- **Real-time Data**: Implement shouldComponentUpdate or React.memo
- **Animation Performance**: Monitor frame rate on lower-end devices

-----

## Extension Points

### Adding New Workflow Stages

1. Define new `WorkflowStage` type
1. Create WorkflowNode instance in Dashboard
1. Position node in layout
1. Add ConnectionLines to HeartbeatDial
1. Update theme styling if needed

### Integrating Real Data

```typescript
// Example integration point
interface WorkflowState {
  stages: {
    code: { status: 'idle' | 'running' | 'success' | 'error', lastRun: Date },
    qa: { status: '...', coverage: number },
    deploy: { status: '...', environment: string }
  }
}

// Hook implementation
const useWorkflowData = () => {
  const [state, setState] = useState<WorkflowState>(initialState);
  
  useEffect(() => {
    // WebSocket or polling logic
    const ws = new WebSocket('wss://api.manjurat.io/workflow');
    ws.onmessage = (event) => {
      setState(JSON.parse(event.data));
    };
    return () => ws.close();
  }, []);
  
  return state;
};
```

### Adding Navigation

```typescript
// Future bottom navigation bar
const BottomNav = () => {
  const stages = ['Plan', 'Code', 'Monitor', 'QA', 'Deploy'];
  const [active, setActive] = useState('Monitor');
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card p-4">
      <div className="flex justify-center gap-8">
        {stages.map(stage => (
          <button
            key={stage}
            onClick={() => setActive(stage)}
            className={active === stage ? 'active' : ''}
          >
            {stage}
          </button>
        ))}
      </div>
    </nav>
  );
};
```

-----

## Technology Stack Deep Dive

### React 18

- **Concurrent Features**: Automatic batching, transitions
- **Hooks**: useState, useEffect, useContext, (future: useReducer)
- **Component Model**: Functional components exclusively

### TypeScript

- **Type Safety**: Interface definitions for all props
- **Enum Usage**: Theme, WorkflowStage types
- **Strict Mode**: Enabled for maximum safety

### Tailwind CSS

- **Utility-First**: Rapid UI development
- **Responsive Design**: Breakpoint utilities
- **Custom Classes**: Extended theme configuration

### Vite

- **Fast HMR**: Instant feedback during development
- **Optimized Builds**: Tree-shaking, code splitting
- **Plugin Ecosystem**: React, TypeScript support

-----

## Security Considerations

### Current Implementation

- **No External Data**: Static UI, no API calls
- **XSS Prevention**: React’s built-in escaping
- **No User Input**: Eliminates injection risks

### Future Considerations

- **API Authentication**: JWT or OAuth for data fetching
- **HTTPS Only**: Enforce secure connections
- **Content Security Policy**: Restrict resource loading
- **Input Sanitization**: Validate all user inputs

-----

## Testing Strategy (Recommended)

### Unit Tests

```typescript
describe('WorkflowNode', () => {
  it('renders with correct label', () => {
    render(<WorkflowNode label="Code" stage="code" ... />);
    expect(screen.getByText('Code')).toBeInTheDocument();
  });
  
  it('applies hover effect', () => {
    const { container } = render(<WorkflowNode ... />);
    fireEvent.mouseEnter(container.firstChild);
    // Assert box-shadow change
  });
});
```

### Integration Tests

- Theme switching affects all components
- WorkflowNode click updates HeartbeatDial status
- ConnectionLines render between correct points

### Visual Regression Tests

- Screenshot comparison (Chromatic, Percy)
- Theme consistency validation
- Animation playback verification

-----

## Deployment Architecture

### Build Process

```bash
npm run build
  │
  ├─ TypeScript compilation
  ├─ Tailwind CSS purge
  ├─ Vite optimization
  └─ Output: dist/
      ├─ index.html
      ├─ assets/
      │   ├─ index-[hash].js
      │   └─ index-[hash].css
      └─ favicon.ico
```

### Hosting Options

1. **Static Hosting**: Vercel, Netlify, GitHub Pages
1. **CDN**: Cloudflare, AWS CloudFront
1. **Container**: Docker + Nginx

### Environment Configuration

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

-----

## Maintenance Guidelines

### Code Organization

- One component per file
- Co-locate types with components
- Group related utilities in `/utils`
- Shared constants in `/constants`

### Documentation Standards

- JSDoc comments for complex functions
- Inline comments for non-obvious logic
- README for each major component directory
- Architecture updates with major changes

### Version Control

- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintenance
- Feature branches for new development
- PR reviews required

-----

## Future Roadmap

### v1.1 - Enhanced Interactivity

- Click handlers for all workflow nodes
- Modal panels with stage details
- Keyboard navigation support

### v1.2 - Real Data Integration

- WebSocket connection for live updates
- REST API integration
- Error handling and retry logic

### v1.3 - Advanced Visualization

- 3D architecture view (Three.js)
- Timeline view for workflow history
- Customizable dashboard layouts

### v2.0 - Multi-Project Support

- Project switcher
- Comparison views
- Team collaboration features

-----

## Conclusion

Manjurat v1.0 establishes a solid foundation with:

- **Modular Architecture**: Easy to extend and maintain
- **Visual Excellence**: Smooth animations and theme support
- **Type Safety**: TypeScript throughout
- **Performance**: Optimized rendering and animations
- **Scalability**: Clear extension points for future features

This architecture document should be updated as the system evolves to reflect new patterns, components, and design decisions.
