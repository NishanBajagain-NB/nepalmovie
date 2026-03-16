import { useEffect, useState } from 'react';
import { adsAPI } from '../services/api';

const PopunderAd = () => {
  const [popunderAds, setPopunderAds] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    fetchPopunderAds();
    
    // Add interaction listeners
    const handleInteraction = () => {
      if (!hasInteracted && popunderAds.length > 0) {
        setHasInteracted(true);
        executePopunder();
      }
    };

    // Listen for various user interactions
    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted, popunderAds]);

  const fetchPopunderAds = async () => {
    try {
      const response = await adsAPI.getAdsByPosition('popunder');
      setPopunderAds(response.data.data || []);
    } catch (error) {
      console.error('Error fetching popunder ads:', error);
    }
  };

  const executePopunder = () => {
    if (popunderAds.length === 0) return;

    // Select a random popunder ad if multiple exist
    const randomAd = popunderAds[Math.floor(Math.random() * popunderAds.length)];
    
    try {
      // Track impression
      adsAPI.trackImpression(randomAd.id).catch(console.error);

      // Execute the popunder script
      if (randomAd.content) {
        // Create a script element and execute it
        const script = document.createElement('script');
        script.innerHTML = randomAd.content;
        document.head.appendChild(script);
        
        // Clean up the script element after execution
        setTimeout(() => {
          document.head.removeChild(script);
        }, 1000);

        // Track click (since popunder was triggered)
        adsAPI.trackClick(randomAd.id).catch(console.error);
        
        console.log('Popunder ad executed:', randomAd.name);
      }
    } catch (error) {
      console.error('Error executing popunder ad:', error);
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default PopunderAd;
