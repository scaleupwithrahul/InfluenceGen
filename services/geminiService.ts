
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const fileToGenerativePart = (imageData: ImageData) => {
  return {
    inlineData: {
      data: imageData.base64,
      mimeType: imageData.mimeType,
    },
  };
};

export const generateInfluencerImage = async (
  productImage: ImageData,
  influencerImage: ImageData,
  prompt: string
): Promise<ImageData | null> => {
  try {
    const systemPrompt = `Task: Create a new, realistic image featuring the influencer from the second image holding the product from the first image.

**Primary Rules (Follow these unless overridden by user prompt):**
1.  **Preserve Influencer Identity**: You MUST retain the influencer's exact face, hair, and physical features from their original image.
2.  **Preserve Influencer Outfit**: You MUST keep the influencer's complete outfit (clothing, accessories, etc.) exactly as it appears in their original image.
3.  **Default Pose**: The influencer should be holding the product naturally in one hand.
4.  **Background**: Create a suitable, photorealistic background that complements the scene.

**User Prompt Overrides:**
- If the user's prompt describes a new outfit, you MUST change the outfit as requested.
- If the user's prompt describes a different pose, you MUST change the pose as requested.
- If the user's prompt describes a specific background, you MUST use that background.

User's prompt: "${prompt}"`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          fileToGenerativePart(productImage),
          fileToGenerativePart(influencerImage),
          { text: systemPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return {
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType,
            };
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating influencer image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};


export const transferPose = async (
  referenceImage: ImageData,
  targetImage: ImageData,
  prompt: string
): Promise<ImageData | null> => {
  try {
    const systemPrompt = `
**Your Mission:** Create a new, photorealistic image by combining elements from two source images. You are an expert at this.

**Image 1 (Reference Image):** This image provides the POSE and the overall SCENE/BACKGROUND STYLE.
*   **Action:** Extract the exact body position, posture, and angle of the person.
*   **Action:** Analyze the background, lighting, and general mood.

**Image 2 (Target Image):** This image provides the PERSON and their OUTFIT.
*   **Action:** Extract the person's face, hair, and physical identity. This is your main subject.
*   **Action:** Extract the complete outfit the person is wearing.

**The Final Image MUST Contain:**
1.  **The Person from the Target Image:** The face and identity must be an exact match.
2.  **The Outfit from the Target Image:** The clothing and accessories must be an exact match.
3.  **The Pose from the Reference Image:** The body posture must be copied precisely.
4.  **A Cohesive Background:** The background should be inspired by the Reference Image's scene and lighting to create a believable environment for the subject. It does not have to be an identical copy, but it must match in style and quality.

**Critical Rule:** Do NOT mix outfits or faces. The person and their clothes come ONLY from the Target Image. The pose comes ONLY from the Reference Image.

User's additional instructions: "${prompt}"`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          fileToGenerativePart(referenceImage),
          fileToGenerativePart(targetImage),
          { text: systemPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return {
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType,
            };
        }
    }
    return null;

  } catch (error) {
    console.error("Error transferring pose:", error);
    throw new Error("Failed to transfer pose. Please check the console for details.");
  }
};

export const editImage = async (
  imageToEdit: ImageData,
  prompt: string
): Promise<ImageData | null> => {
    try {
        const systemPrompt = `You are an expert image editor. The user has provided an image and a text prompt. Your task is to edit the image based *only* on the instructions in the text prompt. Make the changes seamlessly and realistically. Do not add, remove, or change anything that isn't specified in the prompt. Output only the edited image.`;

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    fileToGenerativePart(imageToEdit),
                    { text: `${systemPrompt}\n\nUser's prompt: "${prompt}"` },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData) {
                return {
                    base64: part.inlineData.data,
                    mimeType: part.inlineData.mimeType,
                };
            }
        }
        return null;
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image. Please check the console for details.");
    }
};