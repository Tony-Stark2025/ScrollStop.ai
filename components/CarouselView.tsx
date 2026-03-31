import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { CarouselData } from '../types';

interface CarouselViewProps {
  data: CarouselData;
}

const CarouselView: React.FC<CarouselViewProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = data.slides;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const currentSlide = slides[currentIndex];

  const handleExport = async () => {
    const element = document.getElementById('carousel-export-node');
    if (!element) return;
    
    try {
      // @ts-ignore
      const canvas = await window.html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `${data.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-slide-${currentIndex + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Failed to export image. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{data.topic}</h2>
        <p className="text-gray-500 dark:text-gray-400">Slide {currentIndex + 1} of {slides.length}</p>
      </div>

      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            id="carousel-export-node"
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full flex flex-col justify-center items-center p-8 text-center bg-cover bg-center"
            style={{
              backgroundImage: currentSlide.imageUrl ? `url(${currentSlide.imageUrl})` : 'none',
            }}
          >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <div className="relative z-10 flex flex-col h-full justify-center space-y-6">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                {currentSlide.title}
              </h3>
              <p className="text-lg sm:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md">
                {currentSlide.content}
              </p>
            </div>
            
            {/* Slide Number Indicator */}
            <div className="absolute bottom-6 right-6 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/80 font-mono text-sm font-bold border border-white/10">
              {currentIndex + 1} / {slides.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex 
                ? 'bg-blue-600 dark:bg-blue-500 w-8' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      <button 
        onClick={handleExport}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
      >
        <Download className="w-5 h-5" />
        Export Slide
      </button>
    </div>
  );
};

export default CarouselView;
