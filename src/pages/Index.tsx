
import React, { useState, useRef } from 'react';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/GameCard';
import { AddGameModal } from '@/components/AddGameModal';
import { EditGameModal } from '@/components/EditGameModal';
import { useToast } from '@/hooks/use-toast';

export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  thumbnail: string;
  steamUrl?: string;
}

const initialGames: Game[] = [
  {
    id: '1',
    title: '1 Million Zombies',
    genre: 'Action, Survival',
    description: 'Survive against overwhelming odds in this intense zombie survival game. Build defenses, manage resources, and fight...',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
    steamUrl: '#'
  },
  {
    id: '2',
    title: 'A Quiet Place - The Road Ahead',
    genre: 'Horror, Adventure',
    description: 'A survival horror adventure set in the post-apocalyptic world of A Quiet Place. Use stealth and silence to avoid deadly...',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop',
    steamUrl: '#'
  },
  {
    id: '3',
    title: 'Abtos Covert',
    genre: 'Action, Stealth',
    description: 'A tactical stealth action game featuring covert operations and strategic gameplay. Plan your missions carefully and...',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    steamUrl: '#'
  },
  {
    id: '4',
    title: 'Age of Empires 2 Battle for Greece',
    genre: 'Strategy, RTS',
    description: 'Experience ancient Greek warfare in this expansion to the legendary RTS. Command Greek city-states and forge your...',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    steamUrl: '#'
  },
  {
    id: '5',
    title: 'Age of Empires IV Anniversary Edition',
    genre: 'Strategy, RTS',
    description: 'The complete Age of Empires IV experience with all DLCs included. Build civilizations, command armies, and shape the...',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop',
    steamUrl: '#'
  },
  {
    id: '6',
    title: 'Age of Wonders 4 - Primal Fury',
    genre: 'Strategy, Fantasy',
    description: 'Unleash primal magic in this fantasy strategy expansion. Command ancient beasts and harness the power of nature...',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=200&fit=crop',
    steamUrl: '#'
  }
];

const Index = () => {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addGame = (gameData: Omit<Game, 'id'>) => {
    const newGame: Game = {
      ...gameData,
      id: Date.now().toString()
    };
    setGames(prev => [...prev, newGame]);
    setShowAddModal(false);
    toast({
      title: "Game Added",
      description: `${gameData.title} has been added to your wishlist!`,
    });
  };

  const editGame = (gameData: Omit<Game, 'id'>) => {
    if (!editingGame) return;
    
    setGames(prev => prev.map(game => 
      game.id === editingGame.id ? { ...gameData, id: editingGame.id } : game
    ));
    setEditingGame(null);
    toast({
      title: "Game Updated",
      description: `${gameData.title} has been updated!`,
    });
  };

  const removeGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    setGames(prev => prev.filter(game => game.id !== gameId));
    toast({
      title: "Game Removed",
      description: `${game?.title} has been removed from your wishlist.`,
      variant: "destructive",
    });
  };

  const saveAsHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Wishlist</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: 'Arial', sans-serif;
            color: white;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .game-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        .game-card:hover {
            transform: translateY(-5px);
        }
        .game-thumbnail {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        .game-title {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .game-genre {
            color: #a0a0a0;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        .game-description {
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        .steam-link {
            display: inline-block;
            background: #1e40af;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
            transition: background 0.3s ease;
        }
        .steam-link:hover {
            background: #1d4ed8;
        }
        .icon {
            width: 40px;
            height: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Game Wishlist
            </h1>
            <p class="subtitle">Discover your next gaming adventure</p>
        </div>
        
        <div class="games-grid">
            ${games.map(game => `
                <div class="game-card">
                    <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-genre">${game.genre}</p>
                    <p class="game-description">${game.description}</p>
                    ${game.steamUrl ? `<a href="${game.steamUrl}" class="steam-link">View on Steam</a>` : ''}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-wishlist.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Wishlist Saved",
      description: "Your game wishlist has been saved as HTML file!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <div className="w-12 h-12 text-purple-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            Game Wishlist
          </h1>
          <p className="text-xl text-purple-200">Discover your next gaming adventure</p>
        </div>

        {/* Add Game Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Game
          </Button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={() => setEditingGame(game)}
              onRemove={() => removeGame(game.id)}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button 
            onClick={saveAsHTML}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            Save Page
          </Button>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddGameModal
            onAdd={addGame}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {editingGame && (
          <EditGameModal
            game={editingGame}
            onEdit={editGame}
            onClose={() => setEditingGame(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
