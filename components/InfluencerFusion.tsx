import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import History from './History';
import EditModal from './EditModal';
import { generateInfluencerImage, editImage } from '../services/geminiService';
import { dataUrlToImageData } from '../utils/imageUtils';
import type { ImageData, HistoryEntry } from '../types';

const ProductIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const InfluencerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

interface InfluencerFusionProps {
  history: HistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
}

const InfluencerFusion: React.FC<InfluencerFusionProps> = ({ history, setHistory }) => {
  const [productImage, setProductImage] = useState<ImageData | null>(null);
  const [influencerImage, setInfluencerImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('A stylish influencer holding a product in hand');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!productImage || !influencerImage || !prompt) {
      setError('Please upload both images and provide a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateInfluencerImage(productImage, influencerImage, prompt);
      if (result) {
        const imageUrl = `data:${result.mimeType};base64,${result.base64}`;
        setGeneratedImage(imageUrl);
        setHistory([{ id: new Date().toISOString(), imageUrl }, ...history]);
      } else {
        setError("The model did not return an image. Please try a different prompt or images.");
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (editPrompt: string) => {
    if (!generatedImage) return;

    const imageToEdit = dataUrlToImageData(generatedImage);
    if (!imageToEdit) {
      setError("Could not read image data for editing.");
      return;
    }

    setIsEditing(true);
    setError(null);

    try {
      const result = await editImage(imageToEdit, editPrompt);
      if (result) {
        const imageUrl = `data:${result.mimeType};base64,${result.base64}`;
        setGeneratedImage(imageUrl);
        setHistory([{ id: new Date().toISOString(), imageUrl }, ...history]);
        setIsEditModalOpen(false);
      } else {
         setError("The model did not return an edited image.");
      }
    } catch (err: any) {
       setError(err.message || 'An unknown error occurred while editing.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleHistorySelect = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    setError(null);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `influencer-fusion-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Product Image"
              onImageUpload={setProductImage}
              previewUrl={productImage ? `data:${productImage.mimeType};base64,${productImage.base64}` : null}
              icon={<ProductIcon />}
            />
            <ImageUploader
              label="Influencer Image"
              onImageUpload={setInfluencerImage}
              previewUrl={influencerImage ? `data:${influencerImage.mimeType};base64,${influencerImage.base64}` : null}
              icon={<InfluencerIcon />}
            />
          </div>
          <div>
            <label htmlFor="prompt" className="block text-lg font-semibold text-gray-300 mb-2">
              Describe the Scene
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              placeholder="e.g., Influencer at a beach, holding the product..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !productImage || !influencerImage}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
          >
            {isLoading ? <><Spinner /> <span className="ml-2">Generating...</span></> : 'Generate Image'}
          </button>
          <History entries={history} onSelect={handleHistorySelect} onClear={() => setHistory([])} />
        </div>

        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-gray-300 text-center">Generated Image</h2>
          <div className="w-full aspect-square bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading && <Spinner />}
            {error && !isLoading && <p className="text-red-400 text-center p-4">{error}</p>}
            {generatedImage && !isLoading && !error && (
              <img src={generatedImage} alt="Generated result" className="w-full h-full object-contain" />
            )}
            {!generatedImage && !isLoading && !error && (
              <p className="text-gray-500">Your result will appear here</p>
            )}
          </div>
          {generatedImage && !isLoading && !error && (
             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button
                 onClick={() => setIsEditModalOpen(true)}
                 className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 px-4 rounded-lg text-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                 aria-label="Edit generated image"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                 </svg>
                 <span>Edit</span>
               </button>
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                aria-label="Download generated image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditModalOpen && generatedImage && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          imageUrl={generatedImage}
          isEditing={isEditing}
        />
      )}
    </>
  );
};

export default InfluencerFusion;