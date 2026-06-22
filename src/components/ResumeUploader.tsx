"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ResumeUploaderProps {
  onAnalysisComplete: (data: any) => void;
}

export default function ResumeUploader({ onAnalysisComplete }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("AI is analyzing your resume...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze resume");
      }

      toast.success("Analysis complete!", { id: toastId });
      onAnalysisComplete({ ...result, jobDescription: jobDescription.trim() });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <div 
        className={`relative group border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-500/30 hover:border-blue-400 hover:bg-white/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          className="hidden" 
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="p-4 bg-blue-500/20 rounded-full mb-4 text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all">
                <UploadCloud size={48} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload your Resume</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Drag & drop your PDF file here, or click to browse. Max size 10MB.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full"
            >
              <div className="p-4 bg-green-500/20 rounded-full mb-4 text-green-400">
                <FileIcon size={48} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 truncate max-w-full px-4">{file.name}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                <X size={16} /> Remove File
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Job Description (Optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for ATS compatibility scoring and tailored feedback..."
          className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
          !file || isUploading 
            ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Analyzing with AI...
          </>
        ) : (
          <>
            <CheckCircle size={24} />
            Analyze Resume
          </>
        )}
      </button>
    </motion.div>
  );
}
