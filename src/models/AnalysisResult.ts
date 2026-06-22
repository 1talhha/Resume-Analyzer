import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysisResult extends Document {
  userId?: string;
  originalFileName: string;
  resumeText: string;
  parsedData: any;
  atsScore?: number;
  jobDescriptionMatched?: string;
  createdAt: Date;
}

const AnalysisResultSchema = new Schema<IAnalysisResult>({
  userId: { type: String, required: false }, // Optional for non-logged in users
  originalFileName: { type: String, required: true },
  resumeText: { type: String, required: true },
  parsedData: { type: Schema.Types.Mixed, required: true },
  atsScore: { type: Number, required: false },
  jobDescriptionMatched: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export const AnalysisResult = mongoose.models.AnalysisResult || mongoose.model<IAnalysisResult>("AnalysisResult", AnalysisResultSchema);
