
import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  thumbnail: string;
  steamUrl?: string;
}

// Convert Supabase data to Game format
const convertSupabaseToGame = (supabaseGame: any): Game => {
  return {
    id: supabaseGame.Title, // Using title as ID since there's no separate ID field
    title: supabaseGame.Title,
    genre: 'Action, Adventure', // Default genre since not in database
    description: `Experience ${supabaseGame.Title} - an exciting gaming adventure that will keep you engaged for hours.`,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop', // Default thumbnail
    steamUrl: supabaseGame.Link
  };
};

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
  const [games, setGames] = useState<Game[]>([]);

  // Fetch games from Supabase
  const { data: supabaseGames, isLoading, error } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      console.log('Fetching games from Supabase...');
      const { data, error } = await supabase
        .from('games-list')
        .select('*');
      
      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }
      
      console.log('Games fetched successfully:', data);
      return data;
    },
  });

  // Convert and set games when data is loaded
  useEffect(() => {
    if (supabaseGames) {
      const convertedGames = supabaseGames.map(convertSupabaseToGame);
      setGames(convertedGames);
    }
  }, [supabaseGames]);

  // Set up real-time subscription for live updates
  useEffect(() => {
    console.log('Setting up real-time subscription...');
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games-list'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Refetch data when changes occur
          if (payload.eventType === 'INSERT') {
            const newGame = convertSupabaseToGame(payload.new);
            setGames(prev => [...prev, newGame]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedGame = convertSupabaseToGame(payload.new);
            setGames(prev => prev.map(game => 
              game.id === updatedGame.id ? updatedGame : game
            ));
          } else if (payload.eventType === 'DELETE') {
            setGames(prev => prev.filter(game => game.id !== payload.old.Title));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Error loading games. Please try again.</div>
      </div>
    );
  }

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
          {games.length > 0 ? (
            games.map(game => (
              <PublicGameCard key={game.id} game={game} />
            ))
          ) : (
            <div className="col-span-full text-center text-white text-xl">
              No games found. Add some games in Supabase to see them here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
