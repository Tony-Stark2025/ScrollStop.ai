import React, { useState, useCallback } from 'react';
import { Sparkles, ArrowRight, UploadCloud, FileText, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { GenerateRequest } from '../types';

interface InputFormProps {
  onGenerate: (request: GenerateRequest) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [goal, setGoal] = useState('Educate');
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
    accept: {
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png']
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((topic.trim() || file) && !isLoading) {
      onGenerate({ topic, audience, tone, goal, file });
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6 text-left">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Omni-Dropzone */}
        <div 
          {...getRootProps()} 
          className={`p-10 border-b-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center text-center
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
            ${file ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                type="button" 
                onClick={removeFile}
                className="mt-2 px-4 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <UploadCloud className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {isDragActive ? "Drop it here!" : "Drag & Drop your raw content"}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Accepts PDF, MP3, MP4, JPEG, or TXT (Max 20MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Context Form */}
        <div className="p-8 space-y-6 bg-gray-50 dark:bg-gray-800/30">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Or paste text / describe the topic manually
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'A 5-step guide to reducing SaaS churn using customer success strategies...'"
              className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none h-24 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., SaaS Founders"
                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              >
                <option value="Professional">Professional & Data-driven</option>
                <option value="Punchy">Punchy & Bold</option>
                <option value="Storytelling">Storytelling & Emotional</option>
                <option value="Academic">Academic & Deep-dive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              >
                <option value="Educate">Educate & Add Value</option>
                <option value="Generate Leads">Generate Leads (DM me)</option>
                <option value="Inspire">Inspire & Motivate</option>
                <option value="Sell">Sell a Product/Service</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || (!topic.trim() && !file)}
        className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            Generating Magic...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Generate Carousel <ArrowRight className="w-5 h-5" />
          </span>
        )}
      </button>
    </form>
  );
};

export default InputForm;
