import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const personalitySchema = {
  type: SchemaType.OBJECT,
  properties: {
    enneagramType: {
      type: SchemaType.NUMBER,
      description: "The user's primary enneagram type number (1-9)",
    },
    personalityOverview: {
      type: SchemaType.STRING,
      description: "4-6 sentences: 2-3 describing core traits starting with 'You are', followed by 1-2 gentle sentences about growth areas using 'Type X tends to...' -- Do not mention their wing.",
      maxLength: 800,
    },
    supportingEvidence: {
      type: SchemaType.ARRAY,
      description: "Exactly 4 key behavioral patterns that indicate their type",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          pattern: { 
            type: SchemaType.STRING,
            description: "Two-word name for this behavioral pattern (e.g. 'Variety Seeking' or 'Innovation Driven')",
            maxLength: 30,
          },
          phrases: {
            type: SchemaType.ARRAY,
            description: "1-3 short phrases from their casts demonstrating this pattern",
            items: { 
              type: SchemaType.STRING,
              description: "A 2-3 word direct quote showing this pattern",
              maxLength: 30,
            },
            maxItems: 4,
            minItems: 1,
          },
          explanation: { 
            type: SchemaType.STRING,
            description: "One clear sentence explaining how these phrases reveal their personality type",
            maxLength: 150,
          },
        },
      },
      maxItems: 6,
      minItems: 3,
    },
    whyNotOtherTypes: {
      type: SchemaType.ARRAY,
      description: "The other likely alternative types that were considered but rejected",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.NUMBER },
          reason: { 
            type: SchemaType.STRING,
            description: "Clear explanation why this type doesn't fit (always use 'Type X' not 'type x' when referencing types), with a short explaination of that type",
            maxLength: 150,
          },
        },
      },
      maxItems: 4,
      minItems: 2,
    },
  },
  required: ["enneagramType", "personalityOverview", "supportingEvidence", "whyNotOtherTypes"],
};

export async function analyzePersonality(bio, casts) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 1.5,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 3072,
      responseMimeType: "application/json",
      responseSchema: personalitySchema,
    },
  });

  const prompt = `Analyze this Farcaster user's bio and casts to determine their enneagram type. Write the analysis speaking directly to them in second person ("You are...").
  
Bio: ${bio || 'No bio provided'}

Recent casts:
${casts.join('\n')}

IMPORTANT FORMATTING RULES:
1. Keep everything extremely concise and specific
2. Use exactly TWO words for pattern names (e.g. "Variety Seeking")
3. Never repeat or concatenate similar words
4. Never use slashes or multiple descriptors
5. Stay under all length limits
6. Focus on behavioral patterns, not assumptions
7. Always capitalize "Type" when referring to enneagram types (e.g., "Type 7" not "type 7")

Provide a personality overview (max 800 characters) that:
1. Starts with 2-3 sentences about their core traits beginning with "You are..."
2. Follows with 1-2 gentle sentences about growth areas using "Type X tends to..." format
3. Include both their primary type and wing in the analysis

Example overview:
"You are an enthusiastic creator, constantly exploring new ideas and sharing your discoveries with others. You have a natural gift for innovation and bringing joy to others through your creations. Type 7s tend to juggle multiple projects simultaneously, which can sometimes lead to scattered energy, but their diverse interests often result in unique and creative solutions."

Identify exactly 4 key behavioral patterns that indicate their type. For each pattern:
- Give it a clear TWO WORD name (e.g. "Variety Seeking" or "Innovation Driven")
- List exactly 3 very short direct quotes (2-3 words) from their casts
- Add one clear sentence explaining how these quotes reveal their personality type

Example format:
Pattern: "Variety Seeking"
Phrases: ["can't stop making", "next project excited", "exploring new ideas"]
Explanation: "Your constant creation of different projects and exploration of new ideas shows a classic Type 7 desire for variety and stimulation."

Choose exactly 3 alternative types that might seem to fit at first glance. For each:
- Provide one clear explanation of why this type doesn't fit
- Focus on observable patterns rather than assumptions
- Keep explanations under 150 characters
- Always use "Type X" format (capitalized) when referring to types

Keep everything extremely concise and specific. Focus on clear behavioral evidence.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const response = result.response;
  try {
    return JSON.parse(response.text());
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Failed to parse response:', response.text());
    throw error;
  }
}

export async function fetchUserInfo(fid) {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        'accept': 'application/json',
        'api_key': process.env.NEYAR_API_KEY || '',
      },
    }
  );
  const data = await response.json();
  return data.users[0];
}

export async function fetchUserCasts(fid) {
  let allCasts = [];
  let cursor = undefined;
  const MAX_PAGES = 5;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL('https://api.neynar.com/v2/farcaster/feed/user/casts');
    url.searchParams.set('fid', fid.toString());
    url.searchParams.set('limit', '150');
    url.searchParams.set('include_replies', 'false');
    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'accept': 'application/json',
        'api_key': process.env.NEYAR_API_KEY || '',
      },
    });

    const data = await response.json();
    const newCasts = data.casts.map(cast => cast.text);
    allCasts = [...allCasts, ...newCasts];

    cursor = data.next?.cursor;
    if (!cursor) break;
  }

  return allCasts;
} 