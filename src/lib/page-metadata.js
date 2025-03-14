import { getFromKV } from './cloudflare-kv';

export async function generateFrameMetadata({ searchParams }) {
  const { fid } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log('base url', baseUrl);
  let imageUrl = "https://cover-art.kasra.codes/enneagram-icon-512-square.png";
  let targetUrl = baseUrl;
  let buttonText = "Analyze My Enneagram";

  if (fid) {
    // Try to get the share image URL from KV
    const cacheKey = `enneagram:share-image:${fid}`;
    const cachedImageUrl = await getFromKV(cacheKey);
    if (cachedImageUrl) {
      try {
        imageUrl = JSON.parse(cachedImageUrl);
        buttonText = "Get Your Enneagram Type";
      } catch (e) {
        console.error('Error parsing cached image URL:', e);
        imageUrl = cachedImageUrl; // fallback to raw value if parsing fails
      }
    }
    // Add fid to the target URL
    targetUrl = `${baseUrl}?fid=${fid}`;
  }

  console.log('image url', imageUrl);

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