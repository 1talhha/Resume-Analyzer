"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Briefcase, GraduationCap, CheckCircle2, AlertCircle, Sparkles, MessageSquare, Code2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AnalysisResults({ data, onReset }: { data: any, onReset: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "feedback" | "cover-letter" | "interview">("overview");
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingIQ, setIsGeneratingIQ] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);

  const result = data?.data || data;
  const jobDescription = data?.jobDescription || "";

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCL(true);
    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData: result, jobDescription })
      });
      const res = await response.json();
      if (res.error) throw new Error(res.error);
      setCoverLetter(res.coverLetter);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const handleGenerateInterview = async () => {
    setIsGeneratingIQ(true);
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData: result, jobDescription })
      });
      const res = await response.json();
      if (res.error) throw new Error(res.error);
      setInterviewQuestions(res.questions);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGeneratingIQ(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full text-left"
    >
      <button onClick={onReset} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={20} /> Back to Upload
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<CheckCircle2 size={18} />} label="Overview & Score" />
          <TabButton active={activeTab === "feedback"} onClick={() => setActiveTab("feedback")} icon={<AlertCircle size={18} />} label="Actionable Feedback" />
          <TabButton active={activeTab === "cover-letter"} onClick={() => { setActiveTab("cover-letter"); if(!coverLetter) handleGenerateCoverLetter(); }} icon={<MessageSquare size={18} />} label="AI Cover Letter" />
          <TabButton active={activeTab === "interview"} onClick={() => { setActiveTab("interview"); if(interviewQuestions.length===0) handleGenerateInterview(); }} icon={<Sparkles size={18} />} label="Mock Interview Prep" />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 min-h-[500px]">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between bg-black/20 p-6 rounded-2xl border border-white/5">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{result.name || "Unknown"}</h2>
                  <p className="text-gray-400">{result.role || "Professional"} • {result.experienceYears || 0} years experience</p>
                </div>
                <div className="text-center mt-4 md:mt-0">
                  <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                    {result.resumeStrength || result.atsScore || 0}%
                  </div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">Resume Strength</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Code2 className="text-blue-400" /> Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills?.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase className="text-orange-400" /> Experience</h3>
                  <div className="space-y-4">
                    {result.careerHistory?.map((exp: any, i: number) => (
                      <div key={i} className="border-l-2 border-orange-500/30 pl-4 py-1">
                        <h4 className="font-medium text-white">{exp.role}</h4>
                        <p className="text-sm text-gray-400">{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><GraduationCap className="text-purple-400" /> Education</h3>
                  <div className="space-y-4">
                    {result.education?.map((edu: any, i: number) => (
                      <div key={i} className="border-l-2 border-purple-500/30 pl-4 py-1">
                        <h4 className="font-medium text-white">{edu.degree}</h4>
                        <p className="text-sm text-gray-400">{edu.institution} • {edu.graduationYear}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "feedback" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">AI Bot Comments</h3>
                <p className="text-gray-300 leading-relaxed">{result.botComments}</p>
              </div>

              {result.skillGaps && result.skillGaps.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-red-300 mb-3">Identified Skill Gaps</h3>
                  <ul className="list-disc pl-5 text-gray-300 space-y-2">
                    {result.skillGaps.map((gap: string, i: number) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Formatting & Structure</h3>
                <p className="text-gray-300 leading-relaxed">{result.formattingFeedback}</p>
              </div>
            </motion.div>
          )}

          {activeTab === "cover-letter" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
              {isGeneratingCL ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Sparkles className="animate-pulse mb-4 text-blue-400" size={32} />
                  <p>AI is crafting your tailored cover letter...</p>
                </div>
              ) : (
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 h-full min-h-[400px]">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Custom Cover Letter</h3>
                  <textarea 
                    readOnly
                    value={coverLetter}
                    className="w-full h-[400px] bg-transparent border-none text-gray-300 resize-none outline-none"
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "interview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {isGeneratingIQ ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Sparkles className="animate-pulse mb-4 text-purple-400" size={32} />
                  <p>AI is generating personalized interview questions...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white mb-4">Mock Interview Questions</h3>
                  {interviewQuestions.map((q, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-2xl p-6">
                      <h4 className="text-lg font-medium text-white mb-2">Q{i + 1}: {q.question}</h4>
                      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                          <strong className="text-blue-300 block mb-1">Why they're asking:</strong>
                          <span className="text-gray-400">{q.why}</span>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                          <strong className="text-green-300 block mb-1">How to answer:</strong>
                          <span className="text-gray-400">{q.tips}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
