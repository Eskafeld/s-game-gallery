
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract Steam app ID from Steam URL
function extractSteamAppId(steamUrl: string): string | null {
  const match = steamUrl.match(/\/app\/(\d+)/);
  return match ? match[1] : null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { steamUrl } = await req.json();
    
    if (!steamUrl) {
      return new Response(JSON.stringify({ error: 'Steam URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const appId = extractSteamAppId(steamUrl);
    if (!appId) {
      return new Response(JSON.stringify({ error: 'Invalid Steam URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching Steam data for app ID: ${appId}`);

    // Fetch game details from Steam Store API
    const steamResponse = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`);
    
    if (!steamResponse.ok) {
      throw new Error('Failed to fetch from Steam API');
    }

    const steamData = await steamResponse.json();
    const gameData = steamData[appId];

    if (!gameData || !gameData.success) {
      return new Response(JSON.stringify({ error: 'Game not found on Steam' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const game = gameData.data;
    
    // Extract relevant information
    const gameInfo = {
      name: game.name || '',
      short_description: game.short_description || '',
      detailed_description: game.detailed_description || '',
      header_image: game.header_image || '',
      screenshots: game.screenshots ? game.screenshots.slice(0, 3).map((s: any) => s.path_thumbnail) : [],
      genres: game.genres ? game.genres.map((g: any) => g.description).join(', ') : '',
      developers: game.developers ? game.developers.join(', ') : '',
      publishers: game.publishers ? game.publishers.join(', ') : '',
      release_date: game.release_date ? game.release_date.date : '',
      metacritic: game.metacritic ? game.metacritic.score : null,
      price: game.price_overview ? {
        currency: game.price_overview.currency,
        initial: game.price_overview.initial_formatted,
        final: game.price_overview.final_formatted,
        discount_percent: game.price_overview.discount_percent
      } : null
    };

    console.log(`Successfully fetched data for: ${gameInfo.name}`);

    return new Response(JSON.stringify(gameInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-steam-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
