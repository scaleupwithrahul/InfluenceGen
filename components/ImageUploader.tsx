import React from 'react';
import type { ImageData } from '../types';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (imageData: ImageData | null) => void;
  previewUrl: string | null;
  icon: JSX.Element;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, previewUrl, icon }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageUpload({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      onImageUpload(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label className="block text-lg font-semibold text-gray-300 mb-3">{label}</label>
      <div className="w-full aspect-square bg-black/20 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:border-purple-400">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-2 text-gray-400">{icon}</div>
            <p>Click or drag file to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;