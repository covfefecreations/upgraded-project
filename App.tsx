import React, { useState, useEffect } from ‘react’;
import { Moon, Sun, Search } from ‘lucide-react’;

// Types
type Theme = ‘light’ | ‘dark’;
type WorkflowStage = ‘code’ | ‘qa’ | ‘deploy’ | ‘plan’;

interface WorkflowNodeProps {
icon: string;
label: string;
stage: WorkflowStage;
position: ‘left’ | ‘right’ | ‘bottom’;
theme: Theme;
subIcons?: string[];
}

// Theme Context
const ThemeContext = React.createContext<{
theme: Theme;
toggleTheme: () => void;
}>({ theme: ‘dark’, toggleTheme: () => {} });

// Heartbeat SVG Icon Component
const HeartbeatIcon: React.FC<{ className?: string }> = ({ className }) => (
<svg viewBox="0 0 100 50" className={className} fill="none" stroke="currentColor" strokeWidth="3">
<path d="M 0 25 L 20 25 L 25 15 L 30 35 L 35 20 L 40 25 L 50 25 L 55 10 L 65 40 L 75 25 L 100 25" />
</svg>
);

// Connection Line Component
const ConnectionLine: React.FC<{
from: { x: number; y: number };
to: { x: number; y: number };
theme: Theme;
}> = ({ from, to, theme }) => {
const midX = (from.x + to.x) / 2;
const midY = (from.y + to.y) / 2;
const controlX = midX;
const controlY = from.y;

const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
const color = theme === ‘dark’ ? ‘#3DD9C1’ : ‘#4DB8A8’;

return (
<svg className=“absolute inset-0 w-full h-full pointer-events-none” style={{ zIndex: 0 }}>
<defs>
<filter id="glow">
<feGaussianBlur stdDeviation="2" result="coloredBlur"/>
<feMerge>
<feMergeNode in="coloredBlur"/>
<feMergeNode in="SourceGraphic"/>
</feMerge>
</filter>
</defs>
<path
d={path}
stroke={color}
strokeWidth="2"
fill="none"
opacity="0.6"
filter="url(#glow)"
/>
<circle r="4" fill={color} opacity="0.8">
<animateMotion
dur="3s"
repeatCount="indefinite"
path={path}
/>
</circle>
</svg>
);
};

// Workflow Node Component
const WorkflowNode: React.FC<WorkflowNodeProps> = ({
icon,
label,
stage,
position,
theme,
subIcons = []
}) => {
const [isHovered, setIsHovered] = useState(false);

const bgColor = theme === ‘dark’ ? ‘bg-[#2C3545]’ : ‘bg-[#6B7E8F]’;
const hoverGlow = theme === ‘dark’
? ‘hover:shadow-[0_0_20px_rgba(61,217,193,0.4)]’
: ‘hover:shadow-[0_0_20px_rgba(77,184,168,0.4)]’;

return (
<div className="flex flex-col items-center gap-3">
<div
className={`${bgColor} ${hoverGlow} rounded-2xl p-6 transition-all duration-300 cursor-pointer relative`}
style={{
width: ‘80px’,
height: ‘80px’,
boxShadow: isHovered ? `0 0 25px ${theme === 'dark' ? 'rgba(61,217,193,0.5)' : 'rgba(77,184,168,0.5)'}` : ‘none’
}}
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
>
<div className="absolute inset-0 flex items-center justify-center text-3xl">
{icon}
</div>
</div>
<span className={`text-sm font-medium ${theme === 'dark' ? 'text-[#E0E6ED]' : 'text-[#2C3E50]'}`}>
{label}
</span>
{subIcons.length > 0 && (
<div className="flex flex-col gap-2">
{subIcons.map((subIcon, idx) => (
<div
key={idx}
className={`${bgColor} rounded-lg p-2 text-lg`}
style={{ width: ‘32px’, height: ‘32px’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’ }}
>
{subIcon}
</div>
))}
</div>
)}
</div>
);
};

// Heartbeat Dial Component
const HeartbeatDial: React.FC<{ theme: Theme }> = ({ theme }) => {
const accentColor = theme === ‘dark’ ? ‘#3DD9C1’ : ‘#4DB8A8’;
const bgColor = theme === ‘dark’ ? ‘bg-[#2C3545]’ : ‘bg-[#6B7E8F]’;

return (
<div className="relative flex items-center justify-center">
{/* Outer glow ring */}
<div
className=“absolute rounded-full animate-pulse”
style={{
width: ‘220px’,
height: ‘220px’,
background: `radial-gradient(circle, transparent 60%, ${accentColor}20 100%)`,
animation: ‘heartbeat 2s ease-in-out infinite’
}}
/>

```
  {/* Middle ring */}
  <div 
    className={`absolute rounded-full ${bgColor}`}
    style={{
      width: '200px',
      height: '200px',
      border: `3px solid ${accentColor}`,
      opacity: 0.6
    }}
  />
  
  {/* Inner core */}
  <div 
    className={`relative rounded-full ${bgColor} flex items-center justify-center`}
    style={{
      width: '160px',
      height: '160px',
      border: `4px solid ${accentColor}`,
      boxShadow: `0 0 30px ${accentColor}40, inset 0 0 20px ${accentColor}20`,
      backdropFilter: 'blur(10px)'
    }}
  >
    <HeartbeatIcon 
      className={`w-24 h-12`}
      style={{ color: accentColor }}
    />
  </div>

  <style>{`
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 1; }
    }
  `}</style>
</div>
```

);
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
const [theme, setTheme] = useState<Theme>(‘dark’);

const toggleTheme = () => {
setTheme(prev => prev === ‘dark’ ? ‘light’ : ‘dark’);
};

const bgPrimary = theme === ‘dark’ ? ‘bg-[#1A1F2E]’ : ‘bg-[#E8DED3]’;
const textPrimary = theme === ‘dark’ ? ‘text-[#E0E6ED]’ : ‘text-[#2C3E50]’;
const textSecondary = theme === ‘dark’ ? ‘text-[#9BA5B1]’ : ‘text-[#5A6C7D]’;
const cardBg = theme === ‘dark’ ? ‘bg-[#252B3B]’ : ‘bg-[#D4C8BD]’;

return (
<ThemeContext.Provider value={{ theme, toggleTheme }}>
<div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300 p-8`}>
{/* Header */}
<div className="max-w-7xl mx-auto mb-12">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="text-3xl">📊</div>
<h1 className="text-3xl font-bold">Manjurat</h1>
</div>
<div className="flex items-center gap-4">
<button
onClick={toggleTheme}
className={`p-2 rounded-lg ${cardBg} hover:opacity-80 transition-opacity`}
>
{theme === ‘dark’ ? <Sun size={20} /> : <Moon size={20} />}
</button>
<button className={`p-2 rounded-lg ${cardBg} hover:opacity-80 transition-opacity`}>
<Search size={20} />
</button>
</div>
</div>
</div>

```
    {/* Main Content Card */}
    <div className="max-w-5xl mx-auto">
      <div 
        className={`${cardBg} rounded-3xl p-12 relative overflow-hidden`}
        style={{ 
          boxShadow: theme === 'dark' 
            ? '0 10px 40px rgba(0,0,0,0.3)' 
            : '0 10px 40px rgba(0,0,0,0.1)',
          minHeight: '600px'
        }}
      >
        {/* Subtitle */}
        <h2 className={`${textSecondary} text-xl mb-12`}>
          Ciate Plorkilcar
        </h2>

        {/* Workflow Layout */}
        <div className="relative" style={{ height: '450px' }}>
          {/* Connection Lines would be positioned here */}
          
          {/* Left Node - Code */}
          <div className="absolute" style={{ left: '50px', top: '150px' }}>
            <WorkflowNode
              icon="💻"
              label="Code"
              stage="code"
              position="left"
              theme={theme}
              subIcons={['📋', '📊']}
            />
          </div>

          {/* Center - Heartbeat Dial */}
          <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <HeartbeatDial theme={theme} />
          </div>

          {/* Right Node - QA/Deploy */}
          <div className="absolute" style={{ right: '50px', top: '150px' }}>
            <WorkflowNode
              icon="🚀"
              label="QA"
              stage="qa"
              position="right"
              theme={theme}
              subIcons={['✅', '📦']}
            />
            <div className={`${textSecondary} text-sm mt-2 text-center`}>Deploy</div>
          </div>

          {/* Bottom Node - Plan Release Review */}
          <div className="absolute" style={{ left: '50%', bottom: '0', transform: 'translateX(-50%)' }}>
            <WorkflowNode
              icon="📋"
              label="Plan Release Review"
              stage="plan"
              position="bottom"
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Footer Note */}
    <div className={`max-w-5xl mx-auto mt-8 text-center ${textSecondary} text-sm`}>
      Manjurat v1.0 - Development Workflow Dashboard
    </div>
  </div>
</ThemeContext.Provider>
```

);
};

export default Dashboard;
