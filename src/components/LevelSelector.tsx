import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Level {
  id: number;
  name: string;
  difficulty: number;
  objects: any[];
  thumbnail?: string;
}

interface LevelSelectorProps {
  levels: Level[];
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
  title: string;
}

export function LevelSelector({ levels, onSelectLevel, onBack, title }: LevelSelectorProps) {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white text-black hover:bg-gray-200">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Back
          </Button>
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {title}
          </h2>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Card 
              key={level.id} 
              className="bg-gray-900 border-gray-700 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => onSelectLevel(level)}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {level.thumbnail ? (
                  <img src={level.thumbnail} alt={level.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">🎮</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {level.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-yellow-400 text-lg">
                    {'★'.repeat(level.difficulty)}
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLevel(level);
                    }}
                    className="bg-white text-black hover:bg-gray-200 h-8 px-4 rounded-md"
                  >
                    Play
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {levels.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Icon name="FolderOpen" size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No levels available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
