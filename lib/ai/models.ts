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
// Evo 1 = fastest and cheapest (default). Evo 2 = smarter. Evo 3 = premium, 3 credits, never free.
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
    description: "Our premium model - for long conversations and your toughest problems",
  },
];
export const CHAT_MESSAGE_COST: Record<string, number> = {
  "claude-haiku-4-5": 1,
  "claude-sonnet-4-5": 1,
  "claude-opus-4-5": 3,
};
export const FREE_ELIGIBLE_MODELS = new Set(["claude-haiku-4-5", "claude-sonnet-4-5"]);
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
// END OF FILE - lib/ai/models.ts (v7 - descriptions)
// If you can see this comment, the paste was not truncated.
// ============================================================
