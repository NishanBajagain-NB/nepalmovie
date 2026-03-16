import { useEffect, useState } from 'react';
import { adsAPI } from '../services/api';

const PopunderAd = () => {
  const [popunderAds, setPopunderAds] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPopunderAds();
  }, []);

  useEffect(() => {
    if (!isLoading && popunderAds.length > 0) {
      // Add interaction listeners only if we have popunder ads
      const handleInteraction = () => {
        if (!hasInteracted) {
          setHasInteracted(true);
          executePopunder();
        }
      };

      // Listen for various user interactions
      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('scroll', handleInteraction, { once: true });
      document.addEventListener('keydown', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };
    }
  }, [hasInteracted, popunderAds, isLoading]);

  const fetchPopunderAds = async () => {
    try {
      setIsLoading(true);
      const response = await adsAPI.getAdsByPosition('popunder');
      const ads = response.data.data || [];
      // Filter only active popunder ads
      const activeAds = ads.filter(ad => ad.is_active && ad.type === 'popunder');
      setPopunderAds(activeAds);
      console.log(`Found ${activeAds.length} active popunder ads`);
    } catch (error) {
      console.error('Error fetching popunder ads:', error);
      setPopunderAds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const executePopunder = () => {
    if (popunderAds.length === 0) {
      console.log('No popunder ads to execute');
      return;
    }

    // Select a random popunder ad if multiple exist
    const randomAd = popunderAds[Math.floor(Math.random() * popunderAds.length)];
    
    try {
      console.log('Executing popunder ad:', randomAd.name);

      // Track impression first
      adsAPI.trackImpression(randomAd.id).catch(err => 
        console.error('Failed to track impression:', err)
      );

      // Execute the popunder script safely
      if (randomAd.content && randomAd.content.trim()) {
        // Create a safe execution environment
        const executeScript = () => {
          try {
            // Create script element
            const script = document.createElement('script');
            script.type = 'text/javascript';
            
            // Clean the content and add safety checks
            let scriptContent = randomAd.content;
            
            // Basic safety: ensure it's wrapped in a try-catch
            if (!scriptContent.includes('try') && !scriptContent.includes('catch')) {
              scriptContent = `
                try {
                  ${scriptContent}
                } catch(e) {
                  console.error('Popunder ad execution error:', e);
                }
              `;
            }
            
            script.innerHTML = scriptContent;
            document.head.appendChild(script);
            
            // Clean up after execution
            setTimeout(() => {
              try {
                if (script.parentNode) {
                  document.head.removeChild(script);
                }
              } catch (e) {
                console.error('Error cleaning up popunder script:', e);
              }
            }, 2000);

            // Track click (since popunder was triggered)
            adsAPI.trackClick(randomAd.id).catch(err => 
              console.error('Failed to track click:', err)
            );
            
            console.log('Popunder ad executed successfully:', randomAd.name);
          } catch (error) {
            console.error('Error creating popunder script:', error);
          }
        };

        // Execute with a small delay to ensure page is ready
        setTimeout(executeScript, 500);
      } else {
        console.warn('Popunder ad has no content:', randomAd.name);
      }
    } catch (error) {
      console.error('Error executing popunder ad:', error);
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default PopunderAd;
