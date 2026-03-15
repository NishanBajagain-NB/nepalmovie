# Vercel Deployment Setup Guide

## 🚨 Current Issue
The frontend on Vercel cannot connect to the backend because it's trying to connect to `http://localhost:5000/api` which only works locally.

## ✅ Your Backend Details
- **Backend IP**: `172.237.44.29`
- **Backend Port**: `5000`
- **API URL**: `http://172.237.44.29:5000/api`
- **Health Check**: `http://172.237.44.29:5000/health`

## 🔧 Solution Steps

### Step 1: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your `nepalmovie` project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables"

3. **Add Environment Variables**
   Add this variable:

   ```
   Name: VITE_API_BASE_URL
   Value: http://172.237.44.29:5000/api
   Environment: Production, Preview, Development
   ```

### Step 2: Redeploy Frontend

After adding environment variables:

1. **Trigger Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

2. **Or Push New Commit**
   ```bash
   cd Frontend
   git add .
   git commit -m "Update backend URL to production IP"
   git push origin main
   ```

### Step 4: Update Backend CORS (Already Done)

The backend has been updated to allow Vercel domain:
```javascript
origin: [
  'https://nepalmovie.vercel.app',
  'https://*.vercel.app',
  // ... other origins
]
```

## 🧪 Testing the Connection

### Method 1: Test Backend Directly
```bash
# Test if backend is accessible
curl http://172.237.44.29:5000/health

# Test API endpoint
curl http://172.237.44.29:5000/api/movies
```

### Method 2: Use Test Script
```bash
cd Frontend
node test-backend.js
```

### Method 3: Browser Console
1. Open https://nepalmovie.vercel.app
2. Open browser developer tools (F12)
3. Check console for API connection logs
4. Look for: `🔗 API Base URL: http://172.237.44.29:5000/api`

## 🔍 Troubleshooting

### Issue: CORS Error
**Error:** `Access to fetch at 'http://...' from origin 'https://nepalmovie.vercel.app' has been blocked by CORS policy`

**Solution:** Make sure your backend server is running and CORS is configured (already done).

### Issue: Network Error
**Error:** `Network Error` or `ERR_NETWORK`

**Possible Causes:**
1. Backend server is not running
2. Wrong backend URL in environment variables
3. Firewall blocking the connection
4. Backend server not accessible from internet

**Solutions:**
1. Start your backend server: `./start-server.sh start`
2. Check if backend is accessible: `curl http://YOUR_BACKEND_URL:5000/health`
3. Update environment variables in Vercel with correct URL

### Issue: Environment Variables Not Working
**Error:** Still connecting to `localhost:5000`

**Solution:**
1. Double-check environment variables in Vercel dashboard
2. Make sure variable name is exactly: `VITE_API_BASE_URL`
3. Redeploy after adding variables
4. Clear browser cache

## 📋 Quick Checklist

- [ ] Backend server is running and accessible
- [ ] Backend URL is correct (test with curl)
- [ ] Environment variables added in Vercel dashboard
- [ ] Environment variable name is `VITE_API_BASE_URL`
- [ ] Frontend redeployed after adding variables
- [ ] CORS is configured on backend (already done)
- [ ] Browser cache cleared

## 🚀 Quick Fix Summary

**Your specific configuration:**

1. **Vercel Environment Variable:**
   ```
   VITE_API_BASE_URL = http://172.237.44.29:5000/api
   ```

2. **Test backend accessibility:**
   ```bash
   curl http://172.237.44.29:5000/health
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Server is running"
   }
   ```

## 📞 Need Help?

1. **Check backend health:** `http://YOUR_BACKEND_URL:5000/health`
2. **Check API endpoint:** `http://YOUR_BACKEND_URL:5000/api/movies`
3. **Check browser console** for detailed error messages
4. **Check Vercel deployment logs** for build errors

---

**Once configured correctly, your Vercel frontend will connect to your backend server! 🎉**