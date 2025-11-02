
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeEmotionFromImage } from './services/geminiService';
import type { EmotionAnalysis } from './types';
import { Loader } from './components/Loader';
import { sampleImages } from './constants';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<EmotionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleSampleImageClick = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "sample.jpg", { type: blob.type });
      setImageFile(file);
      setImageUrl(url);
    } catch (err) {
      setError("Failed to load sample image. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeEmotionFromImage(imageFile);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Analysis failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />

        <div className="max-w-4xl mx-auto mt-8 bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col space-y-6">
              <ImageUploader onImageChange={handleImageChange} imageUrl={imageUrl} />
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">Or try a sample image:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Sample ${index + 1}`}
                      className="rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 hover:ring-2 ring-indigo-500"
                      onClick={() => handleSampleImageClick(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <div className="flex-grow flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-6 min-h-[300px] md:min-h-full">
                {isLoading && <Loader />}
                {error && <p className="text-red-400 text-center">{error}</p>}
                {!isLoading && !error && analysisResult && <ResultDisplay result={analysisResult} />}
                {!isLoading && !error && !analysisResult && (
                  <div className="text-center text-gray-400">
                    <p className="text-lg">Your analysis will appear here.</p>
                    <p className="text-sm mt-1">Upload an image and click "Analyze Emotion".</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleAnalyzeClick}
                disabled={!imageFile || isLoading}
                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Emotion'}
              </button>
            </div>
          </div>
        </div>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Gemini AI</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
