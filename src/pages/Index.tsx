
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  thumbnail: string;
  steamUrl?: string;
}

const games: Game[] = [
  {
    id: '1',
    title: '1 Million Zombies',
    genre: 'Action, Survival',
    description: 'Survive against overwhelming odds in this intense zombie survival game. Build defenses, manage resources, and fight...',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
    steamUrl: 'https://store.steampowered.com/app/2331220/'
  },
  {
    id: '2',
    title: 'A Quiet Place - The Road Ahead',
    genre: 'Horror, Adventure',
    description: 'A survival horror adventure set in the post-apocalyptic world of A Quiet Place. Use stealth and silence to avoid deadly...',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop',
    steamUrl: 'https://store.steampowered.com/app/2233120/A_Quiet_Place_The_Road_Ahead/'
  },
  {
    id: '3',
    title: 'Abtos Covert',
    genre: 'Action, Stealth',
    description: 'A tactical stealth action game featuring covert operations and strategic gameplay. Plan your missions carefully and...',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    steamUrl: 'https://store.steampowered.com/app/1694230/Abtos_Covert/'
  },
  {
    id: '4',
    title: 'Age of Empires 2 Battle for Greece',
    genre: 'Strategy, RTS',
    description: 'Experience ancient Greek warfare in this expansion to the legendary RTS. Command Greek city-states and forge your...',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    steamUrl: 'https://store.steampowered.com/app/813780/'
  },
  {
    id: '5',
    title: 'Age of Empires IV Anniversary Edition',
    genre: 'Strategy, RTS',
    description: 'The complete Age of Empires IV experience with all DLCs included. Build civilizations, command armies, and shape the...',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop',
    steamUrl: 'https://store.steampowered.com/app/1466860/'
  },
  {
    id: '6',
    title: 'Age of Wonders 4 - Primal Fury',
    genre: 'Strategy, Fantasy',
    description: 'Unleash primal magic in this fantasy strategy expansion. Command ancient beasts and harness the power of nature...',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=200&fit=crop',
    steamUrl: 'https://store.steampowered.com/app/2401850/'
  }
];

const PublicGameCard: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-0">
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover"
          />
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
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m7 7 10 10-5 1z"></path>
                  <path d="m13 17 6-6"></path>
                  <path d="m7 7 6-6"></path>
                </svg>
                View on Steam
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <Link to="/admin">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Manage Games
              </Button>
            </Link>
          </div>
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

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <PublicGameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
