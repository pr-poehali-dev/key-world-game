import { useState } from 'react';
import GameCanvas from '@/components/GameCanvas';
import GameMenu from '@/components/GameMenu';
import LevelSelector from '@/components/LevelSelector';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {currentLevel === null ? (
        <LevelSelector onSelectLevel={setCurrentLevel} />
      ) : (
        <>
          <GameCanvas 
            level={currentLevel} 
            onOpenMenu={() => setShowMenu(true)}
            onExit={() => setCurrentLevel(null)}
          />
          <GameMenu 
            isOpen={showMenu} 
            onClose={() => setShowMenu(false)}
            level={currentLevel}
          />
        </>
      )}
    </div>
  );
};

export default Index;
