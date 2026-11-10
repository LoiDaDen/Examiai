import { createOpenAI } from "@ai-sdk/openai";

const DEFAULT_MODEL = "nvidia/nemotron-3.5-super-vl:free";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getModelId(name: string): string {
  return process.env[name]?.trim() || DEFAULT_MODEL;
}

function createOpenRouter() {
  return createOpenAI({
    apiKey: requiredEnv("OPENROUTER_API_KEY"),
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      "HTTP-Referer": "https://staging.loiden.io.vn",
      "X-Title": "Examinai Staging",
    },
  });
}

export function chatModel() {
  return createOpenRouter().chat(
    getModelId("AI_CHAT_MODEL")
  );
}

export function visionModel() {
  return createOpenRouter().chat(
    getModelId("AI_VISION_MODEL")
  );
}

export function namingModel() {
  return createOpenRouter().chat(
    getModelId("AI_NAMING_MODEL")
  );
}

export function getRandomApiKey(): string {
  const keys = (process.env.FIREWORKS_AI_API_KEY ?? "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);

  if (keys.length === 0) {
    return "";
  }

  return keys[Math.floor(Math.random() * keys.length)];
}
