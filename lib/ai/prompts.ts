import type { Geo } from "@vercel/functions";

export type RequestHints = {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
  locale?: string;
};

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

export const codePrompt = `
You are a Python code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops
`;

export const sheetPrompt = `
You are a spreadsheet creation assistant. Create a spreadsheet in csv format based on the given prompt. The spreadsheet should contain meaningful column headers and data.
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: string
) => {
  if (type === "text") {
    return `Improve the following contents of the document based on the given prompt.

${currentContent}`;
  }

  if (type === "code") {
    return `Improve the following code snippet based on the given prompt.

${currentContent}`;
  }

  if (type === "sheet") {
    return `Improve the following spreadsheet based on the given prompt.

${currentContent}`;
  }

  return "";
};

export const titlePrompt = `
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`;

// ============================================================
// END OF FILE - lib/ai/prompts.ts (v2.1 - complete + locale)
// If you can see this comment, the paste was not truncated.
// ============================================================
