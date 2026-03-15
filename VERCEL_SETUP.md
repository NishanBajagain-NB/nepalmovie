# Vercel Deployment Setup Guide

## 🚨 Current Issue
The frontend on Vercel cannot connect to the backend because it's trying to connect to `http://localhost:5000/api` which only works locally.

## 🔧 Solution Steps

### Step 1: Get Your Backend URL
First, you need to know where your backend is running:

**Option A: Domain Name**
```
https://yourdomain.com
```

**Option B: Server IP Address**
```
http://123.456.789.123:5000
```

**Option C: Cloud Service URL**
```
https://your-app.herokuapp.com
https://your-app.railway.app
```

### Step 2: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your `nepalmovie` project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables"

3. **Add Environment Variables**
   Add these variables:

   ```
   Name: VITE_API_BASE_URL
   Value: http://YOUR_BACKEND_URL:5000/api
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_SITE_NAME
   Value: Nepal Movie
   Environment: Production, Preview, Development
   ```

   **Example Values:**
   - If backend on domain: `https://api.yourdomain.com/api`
   - If backend on IP: `http://123.456.789.123:5000/api`

### Step 3: Redeploy Frontend

After adding environment variables:

1. **Trigger Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

2. **Or Push New Commit**
   ```bash
   cd Frontend
   git add .
   git commit -m "Update environment variables for production"
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

### Method 1: Browser Console
1. Open https://nepalmovie.vercel.app
2. Open browser developer tools (F12)
3. Check console for API connection logs
4. Look for: `🔗 API Base URL: http://your-backend-url:5000/api`

### Method 2: Network Tab
1. Open developer tools
2. Go to "Network" tab
3. Refresh the page
4. Look for API calls to your backend URL

### Method 3: Direct API Test
Test your backend API directly:
```bash
curl http://YOUR_BACKEND_URL:5000/health
```

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

## 🚀 Example Configuration

### If your backend runs on IP `192.168.1.100`:

**Vercel Environment Variable:**
```
VITE_API_BASE_URL = http://192.168.1.100:5000/api
```

**Test backend accessibility:**
```bash
curl http://192.168.1.100:5000/health
```

### If your backend runs on domain `api.yourdomain.com`:

**Vercel Environment Variable:**
```
VITE_API_BASE_URL = https://api.yourdomain.com/api
```

**Test backend accessibility:**
```bash
curl https://api.yourdomain.com/health
```

## 📞 Need Help?

1. **Check backend health:** `http://YOUR_BACKEND_URL:5000/health`
2. **Check API endpoint:** `http://YOUR_BACKEND_URL:5000/api/movies`
3. **Check browser console** for detailed error messages
4. **Check Vercel deployment logs** for build errors

---

**Once configured correctly, your Vercel frontend will connect to your backend server! 🎉**