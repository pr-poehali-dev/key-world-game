import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface LeaderboardEntry {
  rank: number;
  username: string;
  stars: number;
  levels: number;
}

interface LeaderboardProps {
  onBack: () => void;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'ProGamer2024', stars: 150, levels: 50 },
  { rank: 2, username: 'KeyMaster', stars: 145, levels: 48 },
  { rank: 3, username: 'SpeedRunner', stars: 142, levels: 47 },
  { rank: 4, username: 'PuzzleSolver', stars: 138, levels: 46 },
  { rank: 5, username: 'NightHawk', stars: 135, levels: 45 },
  { rank: 6, username: 'ShadowWalker', stars: 130, levels: 43 },
  { rank: 7, username: 'StarCollector', stars: 128, levels: 42 },
  { rank: 8, username: 'MapExplorer', stars: 125, levels: 41 },
  { rank: 9, username: 'QuickFinish', stars: 120, levels: 40 },
  { rank: 10, username: 'BrainTeaser', stars: 115, levels: 38 },
];

export function Leaderboard({ onBack }: LeaderboardProps) {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white text-black hover:bg-gray-200">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Back
          </Button>
          <h2 className="text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <Icon name="Trophy" size={36} className="text-yellow-400" />
            Global Leaderboard
          </h2>
          <div className="w-24" />
        </div>

        <div className="space-y-3">
          {mockLeaderboard.map((entry) => (
            <Card 
              key={entry.rank}
              className={`bg-gray-900 border-gray-700 p-4 hover:border-gray-600 transition-colors ${
                entry.rank <= 3 ? 'border-2 border-yellow-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${
                    entry.rank === 1 ? 'text-yellow-400' :
                    entry.rank === 2 ? 'text-gray-400' :
                    entry.rank === 3 ? 'text-orange-600' :
                    'text-gray-500'
                  }`} style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {getMedalEmoji(entry.rank)}
                  </div>
                  <div>
                    <div className="text-white text-xl font-semibold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      {entry.username}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {entry.levels} уровней пройдено
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-2xl font-bold flex items-center gap-1">
                    {'★'.repeat(Math.min(3, Math.floor(entry.stars / 50)))}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {entry.stars} звёзд
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-gray-900/50 border-gray-700 p-6">
            <div className="text-gray-400 text-lg mb-2">
              Ваша позиция
            </div>
            <div className="text-white text-3xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Пройдите уровни, чтобы попасть в рейтинг!
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
