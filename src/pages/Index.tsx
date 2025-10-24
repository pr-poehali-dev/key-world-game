import { useState } from 'react';
import { GameMenu } from '@/components/GameMenu';
import { LevelSelector } from '@/components/LevelSelector';
import GameCanvas from '@/components/GameCanvas';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'key' | 'gate' | 'obstacle' | 'platform';
  color?: string;
}

interface Level {
  id: number;
  name: string;
  difficulty: number;
  objects: GameObject[];
}

const defaultLevels: Level[] = [
  {
    id: 1,
    name: "First Steps",
    difficulty: 1,
    objects: [
      { x: 0, y: 550, width: 800, height: 50, type: 'platform' },
      { x: 150, y: 500, width: 100, height: 20, type: 'platform' },
      { x: 300, y: 450, width: 100, height: 20, type: 'platform' },
      { x: 450, y: 400, width: 100, height: 20, type: 'platform' },
      { x: 200, y: 350, width: 20, height: 20, type: 'key' },
      { x: 700, y: 470, width: 40, height: 80, type: 'gate' }
    ]
  },
  {
    id: 2,
    name: "The Gap",
    difficulty: 2,
    objects: [
      { x: 0, y: 550, width: 200, height: 50, type: 'platform' },
      { x: 350, y: 550, width: 200, height: 50, type: 'platform' },
      { x: 600, y: 550, width: 200, height: 50, type: 'platform' },
      { x: 400, y: 500, width: 20, height: 20, type: 'key' },
      { x: 750, y: 470, width: 40, height: 80, type: 'gate' }
    ]
  },
  {
    id: 3,
    name: "Danger Zone",
    difficulty: 3,
    objects: [
      { x: 0, y: 550, width: 800, height: 50, type: 'platform' },
      { x: 150, y: 480, width: 120, height: 20, type: 'platform' },
      { x: 350, y: 420, width: 120, height: 20, type: 'platform' },
      { x: 550, y: 360, width: 120, height: 20, type: 'platform' },
      { x: 200, y: 520, width: 60, height: 30, type: 'obstacle' },
      { x: 400, y: 460, width: 60, height: 30, type: 'obstacle' },
      { x: 300, y: 300, width: 20, height: 20, type: 'key' },
      { x: 700, y: 470, width: 40, height: 80, type: 'gate' }
    ]
  }
];

const Index = () => {
  const [currentSection, setCurrentSection] = useState<string>('menu');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setCurrentSection('game');
  };

  const handleLevelComplete = (stars: number) => {
    console.log(`Level completed with ${stars} stars!`);
    setCurrentSection('play');
    setSelectedLevel(null);
  };

  const handleBackFromGame = () => {
    setCurrentSection('play');
    setSelectedLevel(null);
  };

  const handleBackToMenu = () => {
    setCurrentSection('menu');
  };

  if (currentSection === 'menu') {
    return <GameMenu onNavigate={handleNavigate} username={username} />;
  }

  if (currentSection === 'play') {
    return (
      <LevelSelector
        levels={defaultLevels}
        onSelectLevel={handleSelectLevel}
        onBack={handleBackToMenu}
        title="Select Level"
      />
    );
  }

  if (currentSection === 'game' && selectedLevel) {
    return (
      <GameCanvas
        level={selectedLevel}
        onComplete={handleLevelComplete}
        onBack={handleBackFromGame}
      />
    );
  }

  if (currentSection === 'custom') {
    return (
      <LevelSelector
        levels={[]}
        onSelectLevel={handleSelectLevel}
        onBack={handleBackToMenu}
        title="Custom Levels"
      />
    );
  }

  return <GameMenu onNavigate={handleNavigate} username={username} />;
};

export default Index;