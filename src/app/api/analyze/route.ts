import { NextRequest, NextResponse } from "next/server";
import { parseResume } from "@/lib/groq";
import connectToDatabase from "@/lib/db";
import { AnalysisResult } from "@/models/AnalysisResult";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF text — pdf-parse v1 exports a plain function
    const pdfParse = require("pdf-parse");
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // Call Groq AI to analyze the resume
    const parsedData = await parseResume(resumeText, jobDescription || undefined);

    // Connect to DB and save the result
    await connectToDatabase();
    
    const analysisRecord = await AnalysisResult.create({
      originalFileName: file.name,
      resumeText,
      parsedData,
      atsScore: parsedData.atsScore,
      jobDescriptionMatched: jobDescription || undefined
    });

    return NextResponse.json({ 
      success: true, 
      data: parsedData,
      recordId: analysisRecord._id
    });
    
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume", details: error.message },
      { status: 500 }
    );
  }
}
