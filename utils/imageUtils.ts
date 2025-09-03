
import type { ImageData } from '../types';

export const dataUrlToImageData = (dataUrl: string): ImageData | null => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    console.error("Invalid data URL format");
    return null;
  }
  const mimeType = match[1];
  const base64 = match[2];
  return { mimeType, base64 };
};
