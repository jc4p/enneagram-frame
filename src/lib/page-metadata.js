const KV_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.KV_BINDING}/values`;

async function getFromKV(key) {
  try {
    const response = await fetch(`${KV_URL}/${key}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
      },
    });
    
    if (response.ok) {
      const data = await response.text();
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from KV:', error);
  }
  return null;
}

export async function generateFrameMetadata({ searchParams }) {
  const { fid } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let imageUrl = "https://cover-art.kasra.codes/enneagram-icon-512-square.png";
  let targetUrl = baseUrl;
  let buttonText = "Analyze My Enneagram";

  if (fid) {
    // Try to get the analysis from KV cache
    const cacheKey = `enneagram:analysis:${fid}`;
    const cachedAnalysis = await getFromKV(cacheKey);
    if (cachedAnalysis?.analysis) {
      // If we have an analysis, show the share button instead
      buttonText = "Get Your Enneagram Type";
      // You could generate a dynamic image here based on the analysis
      // imageUrl = cachedAnalysis.dynamicImageUrl;
    }
    // Add fid to the target URL
    targetUrl = `${baseUrl}?fid=${fid}`;
  }

  return {
    title: "Enneagram Guesser",
    description: "Discover your Enneagram type through your Farcaster presence",
    icons: {
      icon: "https://cover-art.kasra.codes/enneagram-icon-512.png",
      shortcut: "https://cover-art.kasra.codes/enneagram-icon-512.png",
      apple: "https://cover-art.kasra.codes/enneagram-icon-512.png",
    },
    other: {
      'fc:frame': JSON.stringify({
        version: "next",
        imageUrl,
        button: {
          title: buttonText,
          action: {
            type: "launch_frame",
            name: "Enneagram Guesser",
            url: targetUrl,
            splashImageUrl: "https://cover-art.kasra.codes/enneagram-icon-512.png",
            splashBackgroundColor: "#FB8F9C"
          }
        }
      })
    }
  };
} 