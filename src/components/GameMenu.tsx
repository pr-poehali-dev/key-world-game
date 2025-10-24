import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface GameMenuProps {
  onNavigate: (section: string) => void;
  username: string | null;
}

export function GameMenu({ onNavigate, username }: GameMenuProps) {
  const menuItems = [
    { id: 'play', label: 'Play', icon: 'Play' },
    { id: 'custom', label: 'Custom Levels', icon: 'Users' },
    { id: 'editor', label: 'Editor', icon: 'Pencil' },
    { id: 'skins', label: 'Skins', icon: 'Palette' },
    { id: 'login', label: username ? username : 'Login', icon: 'UserCircle' },
    { id: 'leaderboard', label: 'Global Leaderboard', icon: 'Trophy' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-7xl font-bold text-white mb-4 tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
          KEY WORLD
        </h1>
        <div className="flex justify-center gap-1 text-yellow-400 text-2xl">
          {[...Array(3)].map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {menuItems.map((item, index) => (
          <Button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="h-16 bg-white hover:bg-gray-200 text-black text-xl font-medium rounded-md transition-all duration-200 hover:scale-105"
            style={{ 
              fontFamily: 'Oswald, sans-serif',
              animationDelay: `${index * 0.1}s` 
            }}
          >
            <Icon name={item.icon as any} size={24} className="mr-3" />
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-12 text-gray-500 text-sm">
        Collect the key 🔑 to open the gate 🚪
      </div>
    </div>
  );
}
