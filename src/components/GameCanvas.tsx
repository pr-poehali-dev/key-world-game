import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface GameCanvasProps {
  level: Level;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

export default function GameCanvas({ level, onComplete, onBack }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<GameObject>({ 
    x: 50, 
    y: 50, 
    width: 30, 
    height: 30, 
    type: 'player' 
  });
  const [hasKey, setHasKey] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickStartRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const MOVE_SPEED = 3;
  const JOYSTICK_DEAD_ZONE = 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleJoystickStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    joystickStartRef.current = { x: touch.clientX, y: touch.clientY };
    setJoystickActive(true);
    setJoystickPos({ x: 0, y: 0 });
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickActive) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - joystickStartRef.current.x;
    const deltaY = touch.clientY - joystickStartRef.current.y;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      setJoystickPos({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      });
    } else {
      setJoystickPos({ x: deltaX, y: deltaY });
    }
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (gameWon) return;

      velocityRef.current = { x: 0, y: 0 };

      if (joystickActive) {
        const distance = Math.sqrt(joystickPos.x ** 2 + joystickPos.y ** 2);
        if (distance > JOYSTICK_DEAD_ZONE) {
          velocityRef.current.x = (joystickPos.x / 50) * MOVE_SPEED;
          velocityRef.current.y = (joystickPos.y / 50) * MOVE_SPEED;
        }
      } else {
        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
          velocityRef.current.x = -MOVE_SPEED;
        }
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
          velocityRef.current.x = MOVE_SPEED;
        }
        if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) {
          velocityRef.current.y = -MOVE_SPEED;
        }
        if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) {
          velocityRef.current.y = MOVE_SPEED;
        }
      }

      let newX = player.x + velocityRef.current.x;
      let newY = player.y + velocityRef.current.y;

      if (newX < 0) newX = 0;
      if (newX + player.width > canvas.width) newX = canvas.width - player.width;
      if (newY < 0) newY = 0;
      if (newY + player.height > canvas.height) newY = canvas.height - player.height;

      let collision = false;
      level.objects.forEach(obj => {
        if (obj.type === 'wall' || obj.type === 'obstacle') {
          if (
            newX < obj.x + obj.width &&
            newX + player.width > obj.x &&
            newY < obj.y + obj.height &&
            newY + player.height > obj.y
          ) {
            if (obj.type === 'obstacle') {
              setPlayer({ ...player, x: 50, y: 50 });
              setHasKey(false);
              return;
            }
            collision = true;
          }
        }
      });

      if (!collision) {
        setPlayer(prev => ({ ...prev, x: newX, y: newY }));
      }

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      level.objects.forEach(obj => {
        if (obj.type === 'key' && !hasKey) {
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (obj.type === 'gate') {
          ctx.fillStyle = hasKey ? '#00FF00' : '#666666';
          ctx.shadowColor = hasKey ? '#00FF00' : '#666666';
          ctx.shadowBlur = hasKey ? 15 : 0;
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
          ctx.shadowBlur = 0;
        } else if (obj.type === 'obstacle') {
          ctx.fillStyle = '#FF0000';
          ctx.shadowColor = '#FF0000';
          ctx.shadowBlur = 10;
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          ctx.shadowBlur = 0;
        } else if (obj.type === 'wall') {
          ctx.fillStyle = '#444444';
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          ctx.strokeStyle = '#666666';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        }
      });

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 10;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      const keyObj = level.objects.find(obj => obj.type === 'key');
      if (keyObj && !hasKey) {
        if (
          player.x < keyObj.x + keyObj.width &&
          player.x + player.width > keyObj.x &&
          player.y < keyObj.y + keyObj.height &&
          player.y + player.height > keyObj.y
        ) {
          setHasKey(true);
        }
      }

      const gateObj = level.objects.find(obj => obj.type === 'gate');
      if (gateObj && hasKey) {
        if (
          player.x < gateObj.x + gateObj.width &&
          player.x + player.width > gateObj.x &&
          player.y < gateObj.y + gateObj.height &&
          player.y + player.height > gateObj.y
        ) {
          setGameWon(true);
          const stars = Math.min(10, level.difficulty + 1);
          setTimeout(() => onComplete(stars), 500);
        }
      }
    };

    const intervalId = setInterval(gameLoop, 1000 / 60);

    return () => clearInterval(intervalId);
  }, [player, level, hasKey, keys, gameWon, onComplete, joystickActive, joystickPos]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-4xl">
        <Button onClick={onBack} variant="outline" className="bg-white text-black hover:bg-gray-200">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Back
        </Button>
        <div className="text-white text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {level.name}
        </div>
        <div className="flex gap-2 items-center">
          <div className="text-yellow-400 text-xl">
            {'★'.repeat(level.difficulty)}
          </div>
          {hasKey && <span className="text-2xl">🔑</span>}
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-gray-700 rounded-lg max-w-full"
        />

        <div 
          className="md:hidden absolute bottom-4 right-4 w-32 h-32 bg-gray-800/50 rounded-full flex items-center justify-center touch-none"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          <div className="w-28 h-28 bg-gray-700/30 rounded-full flex items-center justify-center">
            <div 
              className="w-12 h-12 bg-white rounded-full shadow-lg transition-transform"
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-gray-400 text-sm text-center">
        <span className="hidden md:inline">Use WASD or Arrow Keys to move</span>
        <span className="md:hidden">Use joystick to move</span>
      </div>

      {gameWon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center animate-scale-in">
            <h2 className="text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Level Complete!
            </h2>
            <div className="text-yellow-400 text-5xl mb-6">
              {'★'.repeat(Math.min(10, level.difficulty + 1))}
            </div>
            <Button onClick={onBack} className="bg-black text-white hover:bg-gray-800">
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
