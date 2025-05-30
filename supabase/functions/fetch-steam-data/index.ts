
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
      console.error('No Steam URL provided');
      return new Response(JSON.stringify({ error: 'Steam URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const appId = extractSteamAppId(steamUrl);
    if (!appId) {
      console.error('Invalid Steam URL format:', steamUrl);
      return new Response(JSON.stringify({ error: 'Invalid Steam URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Attempting to fetch Steam data for app ID: ${appId} from URL: ${steamUrl}`);

    // Use a more reliable Steam API endpoint with additional parameters
    const steamApiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english&v=1`;
    console.log(`Steam API URL: ${steamApiUrl}`);

    // Fetch game details from Steam Store API with custom headers
    const steamResponse = await fetch(steamApiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GameWishlistBot/1.0)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    
    console.log(`Steam API response status: ${steamResponse.status}`);
    console.log(`Steam API response headers:`, Object.fromEntries(steamResponse.headers.entries()));

    if (!steamResponse.ok) {
      console.error(`Steam API returned status ${steamResponse.status}: ${steamResponse.statusText}`);
      const errorText = await steamResponse.text();
      console.error('Steam API error response:', errorText);
      
      return new Response(JSON.stringify({ 
        error: `Steam API returned status ${steamResponse.status}`,
        details: errorText.substring(0, 200) // Limit error details
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseText = await steamResponse.text();
    console.log(`Steam API response length: ${responseText.length} characters`);
    console.log(`Steam API response preview: ${responseText.substring(0, 200)}...`);

    let steamData;
    try {
      steamData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Steam API response as JSON:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
      return new Response(JSON.stringify({ error: 'Invalid JSON response from Steam API' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Steam data structure:`, Object.keys(steamData));
    
    const gameData = steamData[appId];
    if (!gameData) {
      console.error(`No data found for app ID ${appId} in Steam response`);
      return new Response(JSON.stringify({ error: 'Game not found in Steam response' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Game data success status: ${gameData.success}`);
    
    if (!gameData.success) {
      console.error(`Steam API reported failure for app ID ${appId}`);
      return new Response(JSON.stringify({ error: 'Steam API reported this game as unavailable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const game = gameData.data;
    console.log(`Successfully parsed game data for: ${game.name}`);
    
    // Extract relevant information with fallbacks
    const gameInfo = {
      name: game.name || 'Unknown Game',
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

    console.log(`Successfully processed Steam data for: ${gameInfo.name}`);
    console.log(`Game info summary: ${gameInfo.genres}, ${gameInfo.developers}, released: ${gameInfo.release_date}`);

    return new Response(JSON.stringify(gameInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in fetch-steam-data function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
