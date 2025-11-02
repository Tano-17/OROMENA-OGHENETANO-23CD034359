
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500">
        Facial Emotion Detector
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
        Upload a photo and let our AI analyze the facial expression to reveal the underlying emotion.
      </p>
    </header>
  );
};
