import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface GameCanvasProps {
  level: Level;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

export default function GameCanvas({ level, onComplete, onBack }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<GameObject>({ 
    x: 50, 
    y: 400, 
    width: 20, 
    height: 20, 
    type: 'player' 
  });
  const [hasKey, setHasKey] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const velocityRef = useRef({ x: 0, y: 0 });
  const onGroundRef = useRef(false);

  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const MOVE_SPEED = 5;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (gameWon) return;

      velocityRef.current.y += GRAVITY;

      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
        velocityRef.current.x = -MOVE_SPEED;
      } else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
        velocityRef.current.x = MOVE_SPEED;
      } else {
        velocityRef.current.x = 0;
      }

      if ((keys.has('ArrowUp') || keys.has('w') || keys.has('W') || keys.has(' ')) && onGroundRef.current) {
        velocityRef.current.y = JUMP_FORCE;
        onGroundRef.current = false;
      }

      let newX = player.x + velocityRef.current.x;
      let newY = player.y + velocityRef.current.y;

      if (newX < 0) newX = 0;
      if (newX + player.width > canvas.width) newX = canvas.width - player.width;

      onGroundRef.current = false;

      level.objects.forEach(obj => {
        if (obj.type === 'platform' || obj.type === 'obstacle') {
          if (
            newX < obj.x + obj.width &&
            newX + player.width > obj.x &&
            newY < obj.y + obj.height &&
            newY + player.height > obj.y
          ) {
            if (obj.type === 'obstacle') {
              setPlayer({ ...player, x: 50, y: 400 });
              velocityRef.current = { x: 0, y: 0 };
              setHasKey(false);
              return;
            }

            if (velocityRef.current.y > 0 && player.y + player.height <= obj.y + 5) {
              newY = obj.y - player.height;
              velocityRef.current.y = 0;
              onGroundRef.current = true;
            } else if (velocityRef.current.y < 0 && player.y >= obj.y + obj.height - 5) {
              newY = obj.y + obj.height;
              velocityRef.current.y = 0;
            } else if (velocityRef.current.x > 0) {
              newX = obj.x - player.width;
            } else if (velocityRef.current.x < 0) {
              newX = obj.x + obj.width;
            }
          }
        }
      });

      if (newY + player.height > canvas.height) {
        newY = canvas.height - player.height;
        velocityRef.current.y = 0;
        onGroundRef.current = true;
      }

      setPlayer(prev => ({ ...prev, x: newX, y: newY }));

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      level.objects.forEach(obj => {
        if (obj.type === 'key' && !hasKey) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obj.type === 'gate') {
          ctx.fillStyle = hasKey ? '#00FF00' : '#666666';
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        } else if (obj.type === 'obstacle') {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        } else if (obj.type === 'platform') {
          ctx.fillStyle = '#2D2D2D';
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
      });

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(player.x, player.y, player.width, player.height);

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
  }, [player, level, hasKey, keys, gameWon, onComplete]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
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

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-gray-700 rounded-lg"
      />

      <div className="mt-4 text-gray-400 text-sm">
        Use Arrow Keys or WASD + Space to move and jump
      </div>

      {gameWon && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
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