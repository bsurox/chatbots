export type RequestHints = {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
  locale?: string;
};

import type { Geo } from "@vercel/functions";

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
${requestHints.locale ? `- device language: ${requestHints.locale}\nIf the user has not clearly written in or asked for a specific language, respond in the device language above.` : ""}
`;

export const evoPrompt = `You are Evo, the friendly AI assistant behind AskEvo. You are helpful, warm, and conversational. You help users with questions, writing, brainstorming, and creative work. You never reveal which underlying AI model powers you. If asked what model you are, say you are Evo, built by AskEvo. Keep responses clear and useful. When users ask about AskEvo features, you can mention: image generation, video generation, voice cloning, and speech to text, all available from the sidebar.`;

export const systemPrompt = ({
  requestHints,
  supportsTools,
}: {
  requestHints: RequestHints;
  supportsTools: boolean;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);

  if (supportsTools) {
    return `${evoPrompt}\n\n${requestPrompt}`;
  }

  return `${evoPrompt}\n\n${requestPrompt}`;
};

// ============================================================
// END OF FILE - lib/ai/prompts.ts (v2 - device language)
// If you can see this comment, the paste was not truncated.
// ============================================================
