export const DEFAULT_CHAT_MODEL = "claude-sonnet-4-6";

export const titleModel = {
  id: "claude-haiku-4-5-20251001",
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

export const chatModels: ChatModel[] = [
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku",
    provider: "anthropic",
    description: "Fast and efficient — great for quick tasks",
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet",
    provider: "anthropic",
    description: "Balanced performance and intelligence",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus",
    provider: "anthropic",
    description: "Most powerful — best for complex tasks",
  },
];

export async function getCapabilities(): Promise
  Record<string, ModelCapabilities>
> {
  return Object.fromEntries(
    chatModels.map((model) => [
      model.id,
      { tools: true, vision: false, reasoning: false },
    ])
  );
}

export const isDemo = process.env.IS_DEMO === "1";

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
