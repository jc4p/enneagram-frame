const NAMESPACE = 'enneagram-analysis';

async function getKVUrl(path) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const namespaceId = process.env.KV_BINDING;
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}${path}`;
}

export async function getFromKV(key) {
  try {
    const url = await getKVUrl(`/values/${NAMESPACE}:${key}`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`KV get failed: ${response.statusText}`);
    }

    return response.text();
  } catch (error) {
    console.error('Error getting from KV:', error);
    return null;
  }
}

export async function putToKV(key, value) {
  try {
    const url = await getKVUrl(`/values/${NAMESPACE}:${key}`);
    const valueToStore = JSON.stringify(value);
    
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

    return true;
  } catch (error) {
    console.error('Error putting to KV:', error);
    return false;
  }
} 