"use client";

import { useState } from "react";
import ResumeUploader from "@/components/ResumeUploader";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {!analysisData ? (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-sm text-blue-300 font-medium tracking-wide">
                <Sparkles size={16} />
                <span>Powered by LLaMA 3 & Groq</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 tracking-tight">
                AI Resume Analyzer
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Upload your resume and instantly receive deep insights, ATS compatibility scoring, and actionable feedback to land your dream job.
              </p>
            </div>

            <ResumeUploader onAnalysisComplete={setAnalysisData} />
          </>
        ) : (
          <div className="w-full text-center">
            <AnalysisResults data={analysisData} onReset={() => setAnalysisData(null)} />
          </div>
        )}
      </div>
    </main>
  );
}
