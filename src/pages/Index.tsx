import { useState } from 'react';
import { GameMenu } from '@/components/GameMenu';
import { LevelSelector } from '@/components/LevelSelector';
import GameCanvas from '@/components/GameCanvas';
import GameEditor from '@/components/GameEditor';
import { SkinsSelector } from '@/components/SkinsSelector';
import { Leaderboard } from '@/components/Leaderboard';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'key' | 'gate' | 'obstacle' | 'wall';
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
    name: "First Room",
    difficulty: 1,
    objects: [
      { x: 0, y: 0, width: 800, height: 20, type: 'wall' },
      { x: 0, y: 0, width: 20, height: 600, type: 'wall' },
      { x: 780, y: 0, width: 20, height: 600, type: 'wall' },
      { x: 0, y: 580, width: 800, height: 20, type: 'wall' },
      { x: 200, y: 200, width: 100, height: 100, type: 'wall' },
      { x: 500, y: 350, width: 120, height: 80, type: 'wall' },
      { x: 400, y: 300, width: 25, height: 25, type: 'key' },
      { x: 700, y: 500, width: 50, height: 60, type: 'gate' }
    ]
  },
  {
    id: 2,
    name: "The Maze",
    difficulty: 2,
    objects: [
      { x: 0, y: 0, width: 800, height: 20, type: 'wall' },
      { x: 0, y: 0, width: 20, height: 600, type: 'wall' },
      { x: 780, y: 0, width: 20, height: 600, type: 'wall' },
      { x: 0, y: 580, width: 800, height: 20, type: 'wall' },
      { x: 150, y: 100, width: 20, height: 300, type: 'wall' },
      { x: 300, y: 200, width: 20, height: 380, type: 'wall' },
      { x: 450, y: 20, width: 20, height: 300, type: 'wall' },
      { x: 600, y: 200, width: 20, height: 380, type: 'wall' },
      { x: 100, y: 450, width: 25, height: 25, type: 'key' },
      { x: 700, y: 50, width: 50, height: 60, type: 'gate' }
    ]
  },
  {
    id: 3,
    name: "Danger Zone",
    difficulty: 3,
    objects: [
      { x: 0, y: 0, width: 800, height: 20, type: 'wall' },
      { x: 0, y: 0, width: 20, height: 600, type: 'wall' },
      { x: 780, y: 0, width: 20, height: 600, type: 'wall' },
      { x: 0, y: 580, width: 800, height: 20, type: 'wall' },
      { x: 200, y: 150, width: 150, height: 20, type: 'wall' },
      { x: 450, y: 250, width: 150, height: 20, type: 'wall' },
      { x: 200, y: 400, width: 150, height: 20, type: 'wall' },
      { x: 250, y: 200, width: 40, height: 40, type: 'obstacle' },
      { x: 500, y: 300, width: 40, height: 40, type: 'obstacle' },
      { x: 350, y: 450, width: 40, height: 40, type: 'obstacle' },
      { x: 650, y: 500, width: 25, height: 25, type: 'key' },
      { x: 700, y: 50, width: 50, height: 60, type: 'gate' }
    ]
  }
];

const Index = () => {
  const [currentSection, setCurrentSection] = useState<string>('menu');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<string>('default');

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

  if (currentSection === 'editor') {
    return <GameEditor />;
  }

  if (currentSection === 'skins') {
    return (
      <SkinsSelector
        onBack={handleBackToMenu}
        selectedSkin={selectedSkin}
        onSelectSkin={setSelectedSkin}
      />
    );
  }

  if (currentSection === 'leaderboard') {
    return <Leaderboard onBack={handleBackToMenu} />;
  }

  return <GameMenu onNavigate={handleNavigate} username={username} />;
};

export default Index;