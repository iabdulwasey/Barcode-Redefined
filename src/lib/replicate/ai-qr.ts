/**
 * AI QR Art Generator
 *
 * Uses Replicate API with Flux/SDXL ControlNet to generate
 * visually artistic QR codes that remain scannable.
 */

import Replicate from "replicate";
import type { V1AIQRRequest, V1AIQRResponse } from "@/types/api";

// Scannable QR art requires high error correction (H = 30% codeword restoration)
// and high controlnet conditioning scale to maintain module fidelity
const CONTROLNET_SCALE = 1.2;
const DEFAULT_GUIDANCE_SCALE = 7.5;

export type AIQRStyle =
  | "watercolor"
  | "oil-painting"
  | "pixel-art"
  | "geometric"
  | "neon"
  | "vintage"
  | "minimalist"
  | "botanical"
  | "custom";

export const AI_QR_STYLE_PROMPTS: Record<AIQRStyle, string> = {
  watercolor:
    "watercolor painting, soft washes of color, paper texture, flowing brushstrokes, artistic",
  "oil-painting":
    "oil painting on canvas, thick impasto brushstrokes, rich colors, classical art style",
  "pixel-art":
    "pixel art, 8-bit style, retro gaming aesthetic, pixelated, vibrant colors",
  geometric:
    "geometric abstract art, sharp angles, flat design, bold shapes, Bauhaus style",
  neon:
    "neon glowing light, cyberpunk aesthetic, dark background, electric blue and pink neon",
  vintage:
    "vintage poster art, aged paper, retro typography, muted tones, 1920s Art Deco style",
  minimalist:
    "minimalist design, clean lines, white space, simple shapes, modern Swiss design",
  botanical:
    "botanical illustration, tropical leaves, flowers, green and gold, Art Nouveau style",
  custom: "",
};

let replicateClient: Replicate | null = null;

function getClient(): Replicate {
  if (!replicateClient) {
    const auth = process.env.REPLICATE_API_TOKEN;
    replicateClient = new Replicate(auth ? { auth } : {});
  }
  return replicateClient;
}

/**
 * Generate an AI-styled QR code image.
 * Returns a URL to the generated image on Replicate's CDN.
 */
export async function generateAIQR(
  request: V1AIQRRequest
): Promise<V1AIQRResponse> {
  const style = (request.style as AIQRStyle | undefined) ?? "geometric";
  const stylePrompt =
    style === "custom"
      ? request.prompt
      : `${AI_QR_STYLE_PROMPTS[style]}, ${request.prompt}`;

  const output = await getClient().run(
    "zylim0702/qr_code_controlnet:628e604e13539f2b905b2e4c90e47aa09de50db7bf55c90394d87fc2f7f44b17",
    {
      input: {
        qr_code_content: request.data,
        prompt: stylePrompt,
        negative_prompt:
          request.negativePrompt ??
          "ugly, blurry, low quality, distorted, unreadable qr code",
        guidance_scale: request.guidanceScale ?? DEFAULT_GUIDANCE_SCALE,
        controlnet_conditioning_scale: CONTROLNET_SCALE,
        num_inference_steps: 30,
        seed: Math.floor(Math.random() * 1000000),
      },
    }
  );

  const imageUrl = Array.isArray(output) ? output[0] : output;
  if (typeof imageUrl !== "string") {
    throw new Error("Replicate did not return a valid image URL.");
  }

  return {
    imageUrl,
    generationId: `ai-qr-${Date.now()}`,
  };
}
