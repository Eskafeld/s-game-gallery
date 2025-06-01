
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SteamRedirect = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');
  const gameName = searchParams.get('name');

  useEffect(() => {
    if (appId) {
      // Redirect to Steam store page
      const steamUrl = `https://store.steampowered.com/app/${appId}`;
      window.location.href = steamUrl;
    } else if (gameName) {
      // Fallback to Steam search if no app ID
      const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
      window.location.href = searchUrl;
    } else {
      // Fallback to Steam homepage
      window.location.href = 'https://store.steampowered.com/';
    }
  }, [appId, gameName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-xl font-bold mb-4">Redirecting to Steam...</div>
        <div className="text-yellow-200">
          If you're not redirected automatically, 
          <a 
            href={appId ? `https://store.steampowered.com/app/${appId}` : 'https://store.steampowered.com/'} 
            className="text-yellow-400 hover:text-yellow-300 underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            click here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SteamRedirect;
