#!/usr/bin/env node

/**
 * Backend Connection Test Script
 * Tests if the backend server is accessible from the frontend
 */

import axios from 'axios';

const BACKEND_URL = 'http://172.237.44.29:5000';
const API_URL = `${BACKEND_URL}/api`;

console.log('🧪 Testing Backend Connection...');
console.log(`🎯 Backend URL: ${BACKEND_URL}`);
console.log(`🔗 API URL: ${API_URL}`);
console.log('');

async function testConnection() {
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('✅ Health check passed:', healthResponse.data.message);
    
    // Test 2: API Base
    console.log('2️⃣ Testing API base...');
    const apiResponse = await axios.get(BACKEND_URL, { timeout: 10000 });
    console.log('✅ API base accessible:', apiResponse.data.message);
    
    // Test 3: Movies endpoint
    console.log('3️⃣ Testing movies endpoint...');
    const moviesResponse = await axios.get(`${API_URL}/movies`, { timeout: 10000 });
    console.log('✅ Movies endpoint working, found', moviesResponse.data.data?.length || 0, 'movies');
    
    // Test 4: CORS preflight
    console.log('4️⃣ Testing CORS...');
    const corsResponse = await axios.options(`${API_URL}/movies`, {
      headers: {
        'Origin': 'https://nepalmovie.vercel.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 10000
    });
    console.log('✅ CORS preflight successful');
    
    console.log('');
    console.log('🎉 All tests passed! Backend is ready for Vercel connection.');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Set environment variable in Vercel:');
    console.log('   VITE_API_BASE_URL = http://172.237.44.29:5000/api');
    console.log('2. Redeploy frontend on Vercel');
    console.log('3. Test the live site: https://nepalmovie.vercel.app');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Backend server is not running or not accessible');
      console.error('   - Check if backend is started: ./start-server.sh status');
      console.error('   - Check firewall settings');
      console.error('   - Verify IP address is correct');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 Cannot resolve hostname');
      console.error('   - Check if IP address is correct');
      console.error('   - Check network connectivity');
    } else if (error.code === 'ECONNABORTED') {
      console.error('💡 Connection timeout');
      console.error('   - Backend might be slow to respond');
      console.error('   - Check server performance');
    }
    
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Verify backend is running: curl http://172.237.44.29:5000/health');
    console.log('2. Check backend logs: ./start-server.sh logs');
    console.log('3. Test from local machine first');
    
    process.exit(1);
  }
}

testConnection();