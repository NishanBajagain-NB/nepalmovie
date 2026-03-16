import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { adsAPI } from '../services/api';

const AdBanner = ({ position = 'top', className = '' }) => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds();
  }, [position]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get ads by position
      const response = await adsAPI.getAdsByPosition(position);
      let filteredAds = response.data.data || [];
      
      // Filter for active ads only
      filteredAds = filteredAds.filter(ad => ad.is_active === true || ad.is_active === 1);
      
      console.log(`Found ${filteredAds.length} active ads for position: ${position}`, filteredAds);
      
      setAds(filteredAds);
      
      if (filteredAds.length > 0) {
        // Select random ad if multiple exist
        const randomAd = filteredAds[Math.floor(Math.random() * filteredAds.length)];
        setCurrentAd(randomAd);
        console.log('Selected ad:', randomAd);
      } else {
        console.log(`No active ads found for position: ${position}`);
        setCurrentAd(null);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError(error.message);
      setCurrentAd(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = () => {
    if (currentAd?.link_url) {
      // Track ad click
      trackAdClick();
      window.open(currentAd.link_url, '_blank');
    }
  };

  const trackAdClick = async () => {
    try {
      if (currentAd?.id) {
        await adsAPI.trackClick(currentAd.id);
        console.log('Ad click tracked:', currentAd.id);
      }
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  };

  const trackAdImpression = async () => {
    try {
      if (currentAd?.id) {
        await adsAPI.trackImpression(currentAd.id);
        console.log('Ad impression tracked:', currentAd.id);
      }
    } catch (error) {
      console.error('Error tracking ad impression:', error);
    }
  };

  useEffect(() => {
    if (currentAd && isVisible && !loading) {
      // Track impression after a short delay to ensure ad is visible
      const timer = setTimeout(() => {
        trackAdImpression();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentAd, isVisible, loading]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't render anything if loading, error, no ad, or not visible
  if (loading) {
    return (
      <div className={`${getAdStyles()} ${className}`}>
        <div className="bg-dark-light rounded-lg border border-dark-lighter p-4 animate-pulse">
          <div className="bg-dark rounded h-20"></div>
        </div>
      </div>
    );
  }

  if (error || !currentAd || !isVisible) {
    return null;
  }

  function getAdStyles() {
    switch (position) {
      case 'top':
        return 'w-full max-w-4xl mx-auto min-h-[90px]';
      case 'sidebar':
        return 'w-full max-w-xs min-h-[250px]';
      case 'bottom':
        return 'w-full max-w-4xl mx-auto min-h-[90px]';
      case 'player':
        return 'w-full max-w-2xl mx-auto min-h-[60px]';
      default:
        return 'w-full min-h-[90px]';
    }
  }

  return (
    <div className={`relative ${getAdStyles()} ${className}`}>
      <div className="relative bg-dark-light rounded-lg overflow-hidden border border-dark-lighter group">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Close ad"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ad content based on type */}
        {currentAd.type === 'code' ? (
          <div 
            className="w-full h-full flex items-center justify-center p-4"
            dangerouslySetInnerHTML={{ __html: currentAd.content }}
          />
        ) : currentAd.type === 'banner' ? (
          <div
            onClick={handleAdClick}
            className="w-full h-full cursor-pointer overflow-hidden"
          >
            {currentAd.image_url ? (
              <img
                src={currentAd.image_url}
                alt={currentAd.name || 'Advertisement'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error('Ad image failed to load:', currentAd.image_url);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary to-red-600 flex items-center justify-center text-white">
                <span className="text-lg font-semibold">{currentAd.name || 'Advertisement'}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-dark flex items-center justify-center text-gray-400">
            <span>Unsupported ad type: {currentAd.type}</span>
          </div>
        )}

        {/* Ad label */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Ad
        </div>

        {/* Ad info (only visible on hover in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {currentAd.name} ({currentAd.type})
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
