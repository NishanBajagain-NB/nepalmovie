import { useState, useEffect } from 'react';
import { adsAPI } from '../services/api';

const AdDebugger = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    testAdsAPI();
  }, []);

  const testAdsAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('checking');

      console.log('🔍 Testing ads API...');

      // Test 1: Get all ads
      console.log('📋 Fetching all ads...');
      const allAdsResponse = await adsAPI.getAll();
      console.log('All ads response:', allAdsResponse);

      const allAds = allAdsResponse.data.data || [];
      setAds(allAds);

      // Test 2: Get ads by position
      const positions = ['top', 'sidebar', 'bottom', 'player', 'popunder'];
      
      for (const position of positions) {
        try {
          console.log(`📍 Fetching ads for position: ${position}`);
          const positionResponse = await adsAPI.getAdsByPosition(position);
          const positionAds = positionResponse.data.data || [];
          console.log(`${position} ads:`, positionAds);
        } catch (posError) {
          console.error(`Error fetching ${position} ads:`, posError);
        }
      }

      setApiStatus('success');
    } catch (error) {
      console.error('❌ Ads API test failed:', error);
      setError(error.message);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  return (
    <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
      <h3 className="text-xl font-bold text-white mb-4">🔧 Ads Debug Panel</h3>
      
      {/* API Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className={`font-medium ${getStatusColor()}`}>
            API Status: {apiStatus}
          </span>
        </div>
        
        {loading && (
          <div className="text-gray-400">Testing ads API...</div>
        )}
        
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">
            Error: {error}
          </div>
        )}
      </div>

      {/* Ads Summary */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">📊 Ads Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark p-3 rounded">
            <div className="text-2xl font-bold text-primary">{ads.length}</div>
            <div className="text-sm text-gray-400">Total Ads</div>
          </div>
          <div className="bg-dark p-3 rounded">
            <div className="text-2xl font-bold text-green-400">
              {ads.filter(ad => ad.is_active).length}
            </div>
            <div className="text-sm text-gray-400">Active Ads</div>
          </div>
          <div className="bg-dark p-3 rounded">
            <div className="text-2xl font-bold text-blue-400">
              {ads.filter(ad => ad.type === 'banner').length}
            </div>
            <div className="text-sm text-gray-400">Banner Ads</div>
          </div>
          <div className="bg-dark p-3 rounded">
            <div className="text-2xl font-bold text-purple-400">
              {ads.filter(ad => ad.type === 'code').length}
            </div>
            <div className="text-sm text-gray-400">Code Ads</div>
          </div>
        </div>
      </div>

      {/* Ads List */}
      {ads.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">📋 All Ads</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-dark p-3 rounded border border-dark-lighter">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{ad.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        ad.type === 'banner' ? 'bg-blue-500/20 text-blue-400' :
                        ad.type === 'popunder' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {ad.type}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400">
                        {ad.position}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Status: {ad.is_active ? '🟢 Active' : '🔴 Inactive'}
                    </div>
                    {ad.type === 'banner' && ad.image_url && (
                      <div className="text-sm text-gray-400 truncate">
                        Image: {ad.image_url}
                      </div>
                    )}
                    {ad.type === 'banner' && ad.link_url && (
                      <div className="text-sm text-gray-400 truncate">
                        Link: {ad.link_url}
                      </div>
                    )}
                    {(ad.type === 'code' || ad.type === 'popunder') && ad.content && (
                      <div className="text-sm text-gray-400">
                        Content: {ad.content.length} characters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6">
        <button
          onClick={testAdsAPI}
          disabled={loading}
          className="bg-primary hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded font-medium"
        >
          {loading ? 'Testing...' : 'Refresh Test'}
        </button>
      </div>
    </div>
  );
};

export default AdDebugger;
