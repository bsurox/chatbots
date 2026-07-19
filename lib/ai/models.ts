export const DEFAULT_CHAT_MODEL = "claude-haiku-4-5";
export const titleModel = {
  id: "claude-haiku-4-5",
  name: "Claude Haiku",
  provider: "anthropic",
  description: "Fast model for title generation",
};
export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};
export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  gatewayOrder?: string[];
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};
// Evo 1 = fastest and cheapest (default). Evo 2 = smarter. Evo 3 = premium, never free.
// Per-message cost scales with thread length via CHAT_COST_BANDS below.
export const chatModels: ChatModel[] = [
  {
    id: "claude-haiku-4-5",
    name: "Evo 1",
    provider: "anthropic",
    description: "Fastest model, great for everyday questions and problems",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Evo 2",
    provider: "anthropic",
    description: "Smarter and more thorough - great for detailed work",
  },
  {
    id: "claude-opus-4-5",
    name: "Evo 3",
    provider: "anthropic",
    description: "Our premium model - for your toughest problems",
  },
];
// Base-band costs. Kept for compatibility; real charging and display both
// use chatCostForThread so the price scales with the conversation.
export const CHAT_MESSAGE_COST: Record<string, number> = {
  "claude-haiku-4-5": 1,
  "claude-sonnet-4-5": 2,
  "claude-opus-4-5": 3,
};
export const FREE_ELIGIBLE_MODELS = new Set(["claude-haiku-4-5", "claude-sonnet-4-5"]);

// ----- Dynamic thread pricing -----
// The model is sent at most this much recent conversation text, and replies
// are capped, so the per-message provider cost is bounded and the bands
// below keep every band profitable at every credit bundle rate.
export const CHAT_CONTEXT_CHAR_LIMIT = 48000;
export const CHAT_MAX_OUTPUT_TOKENS = 1024;

export type CostBand = { upToChars: number; credits: number };

// Thread size is the character count of the conversation BEFORE the new
// message, so the composer can always show the exact price of sending.
export const CHAT_COST_BANDS: Record<string, CostBand[]> = {
  "claude-haiku-4-5": [
    { upToChars: 28000, credits: 1 },
    { upToChars: Number.POSITIVE_INFINITY, credits: 2 },
  ],
  "claude-sonnet-4-5": [
    { upToChars: 12000, credits: 2 },
    { upToChars: 28000, credits: 3 },
    { upToChars: Number.POSITIVE_INFINITY, credits: 4 },
  ],
  "claude-opus-4-5": [
    { upToChars: 12000, credits: 3 },
    { upToChars: 28000, credits: 5 },
    { upToChars: Number.POSITIVE_INFINITY, credits: 7 },
  ],
};

export function chatCostForThread(modelId: string, threadChars: number): number {
  const bands = CHAT_COST_BANDS[modelId];
  if (!bands) {
    return CHAT_MESSAGE_COST[modelId] ?? 1;
  }
  for (const band of bands) {
    if (threadChars <= band.upToChars) {
      return band.credits;
    }
  }
  return bands[bands.length - 1].credits;
}

type LoosePart = { type?: string; text?: string };
type LooseMessage = { parts?: LoosePart[] };

// Shared by the composer (client) and the chat route (server) so the
// displayed price and the charged price always agree. Counts only text
// parts, identically on both sides.
export function countThreadChars(messages: LooseMessage[]): number {
  let total = 0;
  for (const message of messages) {
    for (const part of message.parts ?? []) {
      if (part.type === "text" && typeof part.text === "string") {
        total += part.text.length;
      }
    }
  }
  return total;
}

export async function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  return Object.fromEntries(
    chatModels.map((model) => [
      model.id,
      { tools: true, vision: true, reasoning: false },
    ])
  );
}
export const isDemo = process.env.IS_DEMO === "1";
export function getActiveModels(): ChatModel[] {
  return chatModels;
}
export const allowedModelIds = new Set(chatModels.map((m) => m.id));
export const modelsByProvider =
chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);

// ============================================================
// END OF FILE - lib/ai/models.ts (v8 - thread pricing bands)
// If you can see this comment, the paste was not truncated.
// ============================================================
