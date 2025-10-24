import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface Skin {
  id: string;
  name: string;
  color: string;
  emoji: string;
  unlocked: boolean;
}

interface SkinsSelectorProps {
  onBack: () => void;
  selectedSkin: string;
  onSelectSkin: (skinId: string) => void;
}

const availableSkins: Skin[] = [
  { id: 'default', name: 'Classic White', color: '#FFFFFF', emoji: '⬜', unlocked: true },
  { id: 'red', name: 'Red Knight', color: '#FF0000', emoji: '🔴', unlocked: true },
  { id: 'blue', name: 'Blue Hero', color: '#0000FF', emoji: '🔵', unlocked: true },
  { id: 'green', name: 'Green Ranger', color: '#00FF00', emoji: '🟢', unlocked: false },
  { id: 'yellow', name: 'Golden Star', color: '#FFD700', emoji: '⭐', unlocked: false },
  { id: 'purple', name: 'Purple Wizard', color: '#9B59B6', emoji: '🟣', unlocked: false },
];

export function SkinsSelector({ onBack, selectedSkin, onSelectSkin }: SkinsSelectorProps) {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white text-black hover:bg-gray-200">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Back
          </Button>
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
            Choose Your Skin
          </h2>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSkins.map((skin) => (
            <Card 
              key={skin.id} 
              className={`bg-gray-900 border-2 ${
                selectedSkin === skin.id ? 'border-yellow-400' : 'border-gray-700'
              } overflow-hidden hover:scale-105 transition-transform cursor-pointer ${
                !skin.unlocked && 'opacity-50'
              }`}
              onClick={() => skin.unlocked && onSelectSkin(skin.id)}
            >
              <div 
                className="aspect-video flex items-center justify-center text-8xl"
                style={{ backgroundColor: skin.color + '20' }}
              >
                {skin.emoji}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {skin.name}
                  {selectedSkin === skin.id && <span className="text-yellow-400">✓</span>}
                </h3>
                <div className="flex items-center justify-between">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: skin.color }}
                  />
                  {skin.unlocked ? (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSkin(skin.id);
                      }}
                      className={`h-8 px-4 rounded-md ${
                        selectedSkin === skin.id 
                          ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                          : 'bg-white text-black hover:bg-gray-200'
                      }`}
                    >
                      {selectedSkin === skin.id ? 'Selected' : 'Select'}
                    </Button>
                  ) : (
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      <Icon name="Lock" size={16} />
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
