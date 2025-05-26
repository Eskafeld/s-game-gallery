
import React from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Game } from '@/pages/Index';

interface GameCardProps {
  game: Game;
  onEdit: () => void;
  onRemove: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onEdit, onRemove }) => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-0">
        <div className="relative group">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={onRemove}
              size="sm"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white p-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
          <p className="text-purple-200 text-sm mb-3">{game.genre}</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {game.description}
          </p>
          
          {game.steamUrl && (
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              <a href={game.steamUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Steam
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
