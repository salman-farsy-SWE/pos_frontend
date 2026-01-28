export default async function handler(req: any, res: any) {
  // Log that the function was called
  console.log('Serverless function called:', {
    method: req.method,
    url: req.url,
    query: req.query
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // Handle all HTTP methods
  if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Backend base URL
  const BACKEND_URL = process.env.VITE_API_URL || 'https://posbackend-production-0f4a.up.railway.app/api/v1';
  
  // Get the path from the rewrite parameter or URL
  // The rewrite sends /api/v1/:path* to this function
  let backendPath = '';
  
  // Try to get from query parameter first (from rewrite)
  if (req.query && (req.query as any).path) {
    const pathParam = (req.query as any).path;
    const pathArray = Array.isArray(pathParam) ? pathParam : [pathParam].filter(Boolean);
    backendPath = pathArray.join('/');
  } else {
    // Fallback: extract from URL
    const requestPath = req.url?.split('?')[0] || '';
    backendPath = requestPath.replace(/^\/api\/v1\//, '');
  }
  
  // Get query string from original URL
  const queryString = req.url?.includes('?') ? '?' + req.url.split('?')[1] : '';
  
  // Construct the full backend URL
  const url = `${BACKEND_URL}/${backendPath}${queryString}`;
  
  console.log('Proxy request:', {
    method: req.method,
    backendPath,
    fullUrl: url,
    originalUrl: req.url,
    query: req.query,
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
