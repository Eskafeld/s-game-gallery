import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  thumbnail: string;
  steamUrl?: string;
  steamData?: {
    short_description?: string;
    detailed_description?: string;
    header_image?: string;
    genres?: string;
    release_date?: string;
    price?: {
      currency: string;
      initial: string;
      final: string;
      discount_percent: number;
    };
  };
}

// Convert Supabase data to Game format
const convertSupabaseToGame = (supabaseGame: any): Game => {
  return {
    id: supabaseGame.Title,
    title: supabaseGame.Title,
    genre: 'Action, Adventure',
    description: `Experience ${supabaseGame.Title} - an exciting gaming adventure that will keep you engaged for hours.`,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
    steamUrl: supabaseGame.Link
  };
};

// Extract Steam app ID from Steam URL
const extractSteamAppId = (steamUrl: string): string | null => {
  const match = steamUrl.match(/\/app\/(\d+)/);
  return match ? match[1] : null;
};

// Get Steam header image URL
const getSteamHeaderImage = (steamUrl: string): string | null => {
  const appId = extractSteamAppId(steamUrl);
  if (!appId) return null;
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

// Try to fetch Steam data using Supabase function as fallback
const fetchSteamDataViaFunction = async (steamUrl: string): Promise<any> => {
  console.log(`Attempting to fetch Steam data via Supabase function for: ${steamUrl}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-steam-data', {
      body: { steamUrl }
    });

    if (error) {
      console.warn('Supabase function error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from Steam API');
    }

    console.log('Successfully fetched Steam data via function:', data.name);
    return data;
  } catch (error) {
    console.warn('Steam function fetch failed:', error);
    throw error;
  }
};

const PublicGameCard: React.FC<{ game: Game }> = ({ game }) => {
  const [steamData, setSteamData] = useState(game.steamData || null);
  const [loadingSteamData, setLoadingSteamData] = useState(false);
  const [steamError, setSteamError] = useState<string | null>(null);

  useEffect(() => {
    if (game.steamUrl && !steamData && !loadingSteamData) {
      setLoadingSteamData(true);
      setSteamError(null);
      
      // Try to fetch detailed Steam data via Supabase function
      fetchSteamDataViaFunction(game.steamUrl)
        .then(data => {
          setSteamData(data);
          console.log(`Steam data loaded for ${game.title}`);
        })
        .catch(error => {
          setSteamError('Steam data unavailable');
          console.warn(`Steam data error for ${game.title}:`, error);
        })
        .finally(() => {
          setLoadingSteamData(false);
        });
    }
  }, [game.steamUrl, steamData, loadingSteamData, game.title]);

  // Use Steam header image if available, fallback to default thumbnail
  const steamHeaderImage = game.steamUrl ? getSteamHeaderImage(game.steamUrl) : null;
  const displayImage = steamData?.header_image || steamHeaderImage || game.thumbnail;
  const displayGenre = steamData?.genres || game.genre;
  const displayDescription = steamData?.short_description || game.description;

  // Get Steam app ID for redirect
  const steamAppId = game.steamUrl ? extractSteamAppId(game.steamUrl) : null;
  const steamRedirectUrl = steamAppId 
    ? `/go-to-steam?id=${steamAppId}&name=${encodeURIComponent(game.title)}`
    : `/go-to-steam?name=${encodeURIComponent(game.title)}`;

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-700 border-2 border-yellow-400 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
      <CardContent className="p-0">
        <div className="w-full h-48 overflow-hidden rounded-t-lg relative">
          {loadingSteamData && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <div className="text-white font-bold text-sm">Loading Steam data...</div>
            </div>
          )}
          <img
            src={displayImage}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn(`Image failed to load for ${game.title}, using fallback`);
              // If Steam header image fails, try the default thumbnail
              if (e.currentTarget.src !== game.thumbnail) {
                e.currentTarget.src = game.thumbnail;
              }
            }}
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-black text-white mb-2 drop-shadow-lg">{game.title}</h3>
          <p className="text-yellow-300 text-sm font-bold mb-3">{displayGenre}</p>
          
          {steamError && (
            <p className="text-red-300 text-xs mb-2 font-semibold">
              ⚠️ {steamError}
            </p>
          )}
          
          <p className="text-gray-100 text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
            {displayDescription}
          </p>
          
          {steamData?.release_date && (
            <p className="text-green-300 text-xs mb-4 font-semibold">
              Release Date: {steamData.release_date}
            </p>
          )}

          {game.steamUrl && (
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-2"
            >
              <a href={steamRedirectUrl} target="_blank" rel="noopener noreferrer">
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

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10; // 5 cards per row, 2 rows = 10 games per page

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

  // Calculate pagination
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl font-bold">Error loading games. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-4 drop-shadow-2xl">
            <div className="w-12 h-12 text-yellow-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            Game Wishlist
          </h1>
          <p className="text-xl text-yellow-200 font-bold">Discover your next gaming adventure</p>
        </div>

        {/* Pagination Controls - Top */}
        {totalPages > 1 && (
          <div className="mb-8">
            <Pagination>
              <PaginationContent className="bg-white/10 backdrop-blur-md rounded-lg p-2">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`text-white font-bold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === 'ellipsis' ? (
                      <PaginationEllipsis className="text-white" />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum as number)}
                        isActive={currentPage === pageNum}
                        className={`font-bold ${
                          currentPage === pageNum 
                            ? 'bg-yellow-400 text-purple-800' 
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`text-white font-bold ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Games Grid - 5 columns, 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {currentGames.length > 0 ? (
            currentGames.map(game => (
              <PublicGameCard key={game.id} game={game} />
            ))
          ) : (
            <div className="col-span-full text-center text-white text-xl font-bold">
              No games found. Add some games in Supabase to see them here!
            </div>
          )}
        </div>

        {/* Pagination Controls - Bottom */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent className="bg-white/10 backdrop-blur-md rounded-lg p-2">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`text-white font-bold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === 'ellipsis' ? (
                      <PaginationEllipsis className="text-white" />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum as number)}
                        isActive={currentPage === pageNum}
                        className={`font-bold ${
                          currentPage === pageNum 
                            ? 'bg-yellow-400 text-purple-800' 
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`text-white font-bold ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
