import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface GameObject {
  id: string;
  type: 'saw' | 'key';
  x: number;
  y: number;
  rotation?: number;
  isLethal?: boolean;
}

interface Trigger {
  id: string;
  type: 'animation' | 'random';
  x: number;
  y: number;
}

const GameEditor = () => {
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [randomEnabled, setRandomEnabled] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [showSpawnMenu, setShowSpawnMenu] = useState(false);
  const [spawnPosition, setSpawnPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ id: string; type: 'object' | 'trigger'; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const initialSaws: GameObject[] = [
      { id: 'saw-1', type: 'saw', x: 200, y: 150, rotation: 0 },
      { id: 'saw-2', type: 'saw', x: 400, y: 300, rotation: 0 },
      { id: 'saw-3', type: 'saw', x: 600, y: 200, rotation: 0 },
    ];
    setGameObjects(initialSaws);
  }, []);

  useEffect(() => {
    if (!animationsEnabled) return;

    const interval = setInterval(() => {
      setGameObjects(prev => prev.map(obj => {
        if (obj.type === 'saw') {
          return { ...obj, rotation: ((obj.rotation || 0) + 5) % 360 };
        }
        return obj;
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [animationsEnabled]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSpawnPosition({ x, y });
    setShowSpawnMenu(true);
  };

  const spawnAnimationTrigger = () => {
    const newTrigger: Trigger = {
      id: `trigger-anim-${Date.now()}`,
      type: 'animation',
      x: spawnPosition.x,
      y: spawnPosition.y
    };
    setTriggers(prev => [...prev, newTrigger]);
    setShowSpawnMenu(false);
  };

  const spawnRandomTrigger = () => {
    const newTrigger: Trigger = {
      id: `trigger-random-${Date.now()}`,
      type: 'random',
      x: spawnPosition.x,
      y: spawnPosition.y
    };
    setTriggers(prev => [...prev, newTrigger]);
    setShowSpawnMenu(false);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
  };

  const toggleRandom = () => {
    if (!randomEnabled) {
      const key1: GameObject = {
        id: 'key-1',
        type: 'key',
        x: 250,
        y: 450,
        isLethal: Math.random() > 0.5
      };
      const key2: GameObject = {
        id: 'key-2',
        type: 'key',
        x: 550,
        y: 450,
        isLethal: !key1.isLethal
      };
      
      setGameObjects(prev => [...prev, key1, key2]);
      setRandomEnabled(true);
    } else {
      setGameObjects(prev => prev.filter(obj => obj.type !== 'key'));
      setRandomEnabled(false);
    }
  };

  const removeTrigger = (triggerId: string) => {
    setTriggers(prev => prev.filter(t => t.id !== triggerId));
    if (selectedTrigger?.id === triggerId) {
      setSelectedTrigger(null);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: string, type: 'object' | 'trigger', currentX: number, currentY: number) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragging({
      id,
      type,
      offsetX: clientX - currentX,
      offsetY: clientY - currentY
    });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragging.offsetX;
    const newY = clientY - dragging.offsetY;

    if (dragging.type === 'object') {
      setGameObjects(prev => prev.map(obj => 
        obj.id === dragging.id ? { ...obj, x: newX, y: newY } : obj
      ));
    } else {
      setTriggers(prev => prev.map(trigger => 
        trigger.id === dragging.id ? { ...trigger, x: newX, y: newY } : trigger
      ));
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e as any);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e as any);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="absolute top-4 left-4 z-50">
        <Card className="bg-gray-900/95 border-gray-700 p-4">
          <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Settings" size={20} />
            Редактор уровня
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Кликните на поле для добавления триггера
          </p>
          
          <div className="space-y-2">
            <div className="text-white text-sm">
              <span className="text-green-400">●</span> Анимации: {animationsEnabled ? 'Вкл' : 'Выкл'}
            </div>
            <div className="text-white text-sm">
              <span className="text-purple-400">●</span> Рандом ключей: {randomEnabled ? 'Вкл' : 'Выкл'}
            </div>
            <div className="text-white text-sm">
              🌀 Пил: {gameObjects.filter(o => o.type === 'saw').length}
            </div>
            <div className="text-white text-sm">
              🔑 Ключей: {gameObjects.filter(o => o.type === 'key').length}
            </div>
          </div>
        </Card>
      </div>

      <div 
        className="w-full h-full relative cursor-crosshair"
        onClick={handleCanvasClick}
      >
        {gameObjects.map(obj => (
          <div
            key={obj.id}
            className="absolute pointer-events-auto cursor-move"
            style={{
              left: obj.x - 40,
              top: obj.y - 40,
              transform: obj.type === 'saw' ? `rotate(${obj.rotation}deg)` : 'none',
              transition: obj.type === 'saw' && animationsEnabled ? 'none' : 'transform 0.3s',
              touchAction: 'none'
            }}
            onMouseDown={(e) => handleDragStart(e, obj.id, 'object', obj.x, obj.y)}
            onTouchStart={(e) => handleDragStart(e, obj.id, 'object', obj.x, obj.y)}
            onClick={(e) => e.stopPropagation()}
          >
            {obj.type === 'saw' && (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border-4 border-red-900 shadow-lg shadow-red-500/50">
                <div className="absolute w-full h-1 bg-red-950"></div>
                <div className="absolute w-1 h-full bg-red-950"></div>
                <div className="absolute w-full h-1 bg-red-950 rotate-45"></div>
                <div className="absolute w-full h-1 bg-red-950 -rotate-45"></div>
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-red-950"></div>
              </div>
            )}
            {obj.type === 'key' && (
              <div 
                className={`w-16 h-16 flex items-center justify-center text-5xl ${
                  obj.isLethal ? 'animate-pulse filter drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]'
                }`}
                title={obj.isLethal ? '💀 Смертельный ключ!' : '✓ Правильный ключ'}
              >
                🔑
              </div>
            )}
          </div>
        ))}

        {triggers.map(trigger => (
          <div
            key={trigger.id}
            className="absolute cursor-move pointer-events-auto"
            style={{ left: trigger.x - 30, top: trigger.y - 30, touchAction: 'none' }}
            onMouseDown={(e) => handleDragStart(e, trigger.id, 'trigger', trigger.x, trigger.y)}
            onTouchStart={(e) => handleDragStart(e, trigger.id, 'trigger', trigger.x, trigger.y)}
            onClick={(e) => {
              e.stopPropagation();
              if (!dragging) setSelectedTrigger(trigger);
            }}
          >
            <div className={`w-16 h-16 rounded-lg border-4 ${
              trigger.type === 'animation' 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-purple-500/20 border-purple-500'
            } flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform`}>
              <Icon 
                name={trigger.type === 'animation' ? 'Play' : 'Shuffle'} 
                size={32} 
                className={trigger.type === 'animation' ? 'text-green-400' : 'text-purple-400'}
              />
            </div>
          </div>
        ))}

        {showSpawnMenu && (
          <div 
            className="absolute bg-gray-900/95 border-2 border-blue-500 rounded-lg p-4 shadow-2xl z-50"
            style={{
              left: spawnPosition.x,
              top: spawnPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-bold mb-3">Добавить триггер</h3>
            <div className="flex flex-col gap-2">
              <Button onClick={spawnAnimationTrigger} variant="outline" className="w-full justify-start">
                <Icon name="Play" className="mr-2" size={18} />
                Триггер анимаций
              </Button>
              <Button onClick={spawnRandomTrigger} variant="outline" className="w-full justify-start">
                <Icon name="Shuffle" className="mr-2" size={18} />
                Триггер рандома
              </Button>
              <Button onClick={() => setShowSpawnMenu(false)} variant="secondary" size="sm" className="mt-2">
                Отмена
              </Button>
            </div>
          </div>
        )}

        {selectedTrigger && (
          <div 
            className={`absolute bg-gray-900/95 border-2 rounded-lg p-4 shadow-xl z-40 ${
              selectedTrigger.type === 'animation' ? 'border-green-500' : 'border-purple-500'
            }`}
            style={{
              right: 20,
              top: 20
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Icon 
                  name={selectedTrigger.type === 'animation' ? 'Play' : 'Shuffle'} 
                  size={20} 
                  className={selectedTrigger.type === 'animation' ? 'text-green-400' : 'text-purple-400'}
                />
                {selectedTrigger.type === 'animation' ? 'Триггер анимаций' : 'Триггер рандома'}
              </h4>
              <Button 
                onClick={() => setSelectedTrigger(null)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            {selectedTrigger.type === 'animation' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white text-sm">Анимации пил:</span>
                  <Button 
                    onClick={toggleAnimations}
                    variant={animationsEnabled ? "default" : "secondary"}
                    size="sm"
                  >
                    {animationsEnabled ? 'Включены' : 'Выключены'}
                  </Button>
                </div>
                <p className="text-gray-400 text-xs">
                  {animationsEnabled 
                    ? '🌀 Пилы вращаются' 
                    : '⏸️ Анимация остановлена'
                  }
                </p>
              </div>
            )}

            {selectedTrigger.type === 'random' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white text-sm">Рандомные ключи:</span>
                  <Button 
                    onClick={toggleRandom}
                    variant={randomEnabled ? "default" : "secondary"}
                    size="sm"
                  >
                    {randomEnabled ? 'Включены' : 'Выключены'}
                  </Button>
                </div>
                {randomEnabled ? (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded p-2">
                    <p className="text-yellow-300 text-xs">
                      ⚠️ Заспавнились 2 ключа:<br/>
                      • Один правильный ✓<br/>
                      • Один смертельный 💀
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs">
                    Включите для спавна двух случайных ключей
                  </p>
                )}
              </div>
            )}

            <Button 
              onClick={() => removeTrigger(selectedTrigger.id)}
              variant="destructive"
              size="sm"
              className="w-full mt-4"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить триггер
            </Button>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 bg-gray-900/80 text-white p-3 rounded-lg border border-gray-700">
        <p className="text-sm font-mono">
          Кликните на поле → Выберите тип триггера → Используйте меню управления
        </p>
      </div>
    </div>
  );
};

export default GameEditor;