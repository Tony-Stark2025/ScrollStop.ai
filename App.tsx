import React, { useState, useCallback } from 'react';
import { CarouselData, GenerateRequest } from './types';
import { generateCarouselStructure, generateSlideImage } from './services/geminiService';
import InputForm from './components/InputForm';
import LoadingView from './components/LoadingView';
import CarouselView from './components/CarouselView';
import { Sparkles, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<'analyzing' | 'generating-images' | 'finalizing'>('analyzing');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (request: GenerateRequest) => {
    setIsLoading(true);
    setError(null);
    setCarouselData(null);
    setLoadingStep('analyzing');

    try {
      // Step 1: Generate Structure
      const structure = await generateCarouselStructure(request);

      // Step 2: Generate Images
      setLoadingStep('generating-images');
      const slidesWithImages = await Promise.all(
        structure.slides.map(async (slide) => {
          try {
            const imageUrl = await generateSlideImage(slide.imagePrompt);
            return { ...slide, imageUrl };
          } catch (imgErr) {
            console.error(`Failed to generate image for slide ${slide.id}:`, imgErr);
            return slide; // Fallback to no image if it fails
          }
        })
      );

      // Step 3: Finalize
      setLoadingStep('finalizing');
      setCarouselData({
        ...structure,
        slides: slidesWithImages,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setCarouselData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              ScrollStop <span className="text-blue-600 dark:text-blue-500">AI</span>
            </h1>
          </div>
          {carouselData && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Carousel
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {!carouselData && !isLoading && (
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Turn messy thoughts into viral carousels.
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Paste your raw notes, a video transcript, or a brain dump. Our AI will structure the narrative and generate stunning, custom visuals for a ready-to-publish LinkedIn or Instagram carousel.
              </p>
            </div>
            <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        )}
        
        {isLoading && (
          <div className="animate-in fade-in duration-500">
            <LoadingView step={loadingStep} />
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-center animate-in slide-in-from-top-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 dark:text-red-400 text-xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">Generation Failed</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button 
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {carouselData && !isLoading && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <CarouselView data={carouselData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
