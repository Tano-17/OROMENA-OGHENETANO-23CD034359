
import React from 'react';

interface ImageUploaderProps {
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        className="relative flex flex-col items-center justify-center w-full aspect-square bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-200"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="text-center p-4">
             <UploadIcon />
            <p className="mt-2 text-sm font-semibold text-gray-300">Click to upload an image</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={onImageChange}
        />
      </label>
    </div>
  );
};
