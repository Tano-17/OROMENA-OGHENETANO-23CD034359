
import React from 'react';
import type { EmotionAnalysis } from '../types';

interface ResultDisplayProps {
  result: EmotionAnalysis;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="text-center animate-fade-in w-full">
      <p className="text-7xl mb-4">{result.emoji}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 capitalize mb-2">
        {result.emotion}
      </h2>
      <p className="text-gray-300 max-w-xs mx-auto">
        {result.description}
      </p>
    </div>
  );
};

// Add a simple fade-in animation for the result
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
