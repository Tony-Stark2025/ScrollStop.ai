import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';

interface LoadingViewProps {
  step: 'analyzing' | 'generating-images' | 'finalizing';
}

const LoadingView: React.FC<LoadingViewProps> = ({ step }) => {
  const steps = [
    { id: 'analyzing', label: 'Analyzing narrative & structuring slides...', icon: FileText },
    { id: 'generating-images', label: 'Generating custom background visuals...', icon: ImageIcon },
    { id: 'finalizing', label: 'Polishing layout...', icon: Sparkles },
  ];

  const currentIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-12">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-800 border-t-blue-600 dark:border-t-blue-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin" />
        </div>
      </div>

      <div className="space-y-6 w-full max-w-md">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive || isPast ? 1 : 0.3, y: 0 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50' : 'bg-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' :
                isPast ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`font-medium ${
                isActive ? 'text-blue-900 dark:text-blue-100' :
                isPast ? 'text-gray-900 dark:text-gray-100' :
                'text-gray-400 dark:text-gray-500'
              }`}>
                {s.label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingView;
