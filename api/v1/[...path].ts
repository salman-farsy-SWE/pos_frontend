export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Backend base URL (should include /api/v1)
  const BACKEND_URL = process.env.VITE_API_URL || 'https://posbackend-production-0f4a.up.railway.app/api/v1';
  
  // Get the path from the catch-all parameter
  // Request to /api/v1/products will have path = ['products']
  const pathArray = Array.isArray(req.query.path) 
    ? req.query.path 
    : (req.query.path ? [req.query.path] : []);
  
  const cleanPath = pathArray.join('/');
  
  // Get query string from the original request URL
  const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const queryParams = urlObj.search;
  
  // Construct the full backend URL
  const url = `${BACKEND_URL}/${cleanPath}${queryParams}`;
  
  console.log('Proxy request:', {
    method: req.method,
    path: pathArray,
    cleanPath,
    fullUrl: url,
    hasAuth: !!req.headers.authorization
  });
  
  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: req.method || 'GET',
      headers,
    };
    
    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
    
    // Forward the request to the backend
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.error('Backend error:', response.status, response.statusText);
      const errorText = await response.text();
      res.status(response.status).json({ error: errorText });
      return;
    }
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Forward the response status
    res.status(response.status);
    
    // Send the response
    if (typeof data === 'string') {
      res.send(data);
    } else {
      res.json(data);
    }
  } catch (error: any) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed', message: error.message });
  }
}
