const NAMESPACE = 'enneagram-analysis';

// Cache the KV URL to avoid rebuilding it on every request
let cachedKVUrl = null;
async function getKVUrl(path) {
  if (!cachedKVUrl) {
    const accountId = process.env.CF_ACCOUNT_ID;
    const namespaceId = process.env.KV_BINDING;
    cachedKVUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`;
  }
  return `${cachedKVUrl}${path}`;
}

// Cache responses in memory for 5 minutes
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getFromKV(key) {
  try {
    const fullKey = `${NAMESPACE}:${key}`;
    console.log('KV: Getting key:', fullKey);
    
    // For share image URLs, bypass all caching
    const isShareImage = key.startsWith('enneagram:share-image:');
    if (!isShareImage) {
      // Check memory cache first
      const cached = cache.get(fullKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('KV: Memory cache hit');
        return cached.value;
      }
    }
    console.log('KV: Memory cache miss, fetching from Cloudflare');

    const url = await getKVUrl(`/values/${fullKey}`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
      },
      // Bypass cache for share images
      cache: isShareImage ? 'no-store' : 'force-cache',
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('KV: Key not found in Cloudflare');
        return null;
      }
      throw new Error(`KV get failed: ${response.statusText}`);
    }

    const value = await response.text();
    console.log('KV: Got value from Cloudflare:', value ? value.substring(0, 50) + '...' : 'null');
    
    // Update memory cache only for non-share-image values
    if (!isShareImage) {
      cache.set(fullKey, {
        value,
        timestamp: Date.now()
      });
    }

    return value;
  } catch (error) {
    console.error('Error getting from KV:', error);
    return null;
  }
}

export async function putToKV(key, value) {
  try {
    const fullKey = `${NAMESPACE}:${key}`;
    console.log('KV: Putting key:', fullKey);
    
    const url = await getKVUrl(`/values/${fullKey}`);
    const valueToStore = JSON.stringify(value);
    console.log('KV: Storing value:', valueToStore.substring(0, 50) + '...');
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: valueToStore,
    });

    if (!response.ok) {
      throw new Error(`KV put failed: ${response.statusText}`);
    }

    // Update memory cache
    cache.set(fullKey, {
      value: valueToStore,
      timestamp: Date.now()
    });
    console.log('KV: Successfully stored and cached');

    return true;
  } catch (error) {
    console.error('Error putting to KV:', error);
    return false;
  }
} 