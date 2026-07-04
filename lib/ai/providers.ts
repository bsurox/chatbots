import { anthropic } from "@ai-sdk/anthropic";
import { isTestEnvironment } from "../constants";
import { titleModel } from "./models";

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment) {
    const { chatModel } = require("./models.mock");
    return chatModel;
  }
  return anthropic(modelId);
}

export function getTitleModel() {
  if (isTestEnvironment) {
    const { titleModel: mockTitleModel } = require("./models.mock");
    return mockTitleModel;
  }
  return anthropic(titleModel.id);
}
