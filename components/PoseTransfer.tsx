import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import History from './History';
import EditModal from './EditModal';
import { transferPose, editImage } from '../services/geminiService';
import { dataUrlToImageData } from '../utils/imageUtils';
import type { ImageData, HistoryEntry } from '../types';

const ReferenceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

interface PoseTransferProps {
  history: HistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
}

const PoseTransfer: React.FC<PoseTransferProps> = ({ history, setHistory }) => {
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
  const [targetImage, setTargetImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('A high-quality, photorealistic image.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!referenceImage || !targetImage) {
      setError('Please upload both a reference and a target image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await transferPose(referenceImage, targetImage, prompt);
       if (result) {
        const imageUrl = `data:${result.mimeType};base64,${result.base64}`;
        setGeneratedImage(imageUrl);
        setHistory([{ id: new Date().toISOString(), imageUrl }, ...history]);
      } else {
        setError("The model did not return an image. Please try different images.");
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
    link.download = `pose-transfer-${Date.now()}.png`;
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
              label="Reference Image (Pose)"
              onImageUpload={setReferenceImage}
              previewUrl={referenceImage ? `data:${referenceImage.mimeType};base64,${referenceImage.base64}` : null}
              icon={<ReferenceIcon />}
            />
            <ImageUploader
              label="Target Image (Person)"
              onImageUpload={setTargetImage}
              previewUrl={targetImage ? `data:${targetImage.mimeType};base64,${targetImage.base64}` : null}
              icon={<TargetIcon />}
            />
          </div>
          <div>
            <label htmlFor="pose-prompt" className="block text-lg font-semibold text-gray-300 mb-2">
              Additional Instructions (Optional)
            </label>
            <textarea
              id="pose-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              placeholder="e.g., Change the lighting to be dramatic..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !referenceImage || !targetImage}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
          >
            {isLoading ? <><Spinner /> <span className="ml-2">Generating...</span></> : 'Transfer Pose'}
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
                className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
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

export default PoseTransfer;