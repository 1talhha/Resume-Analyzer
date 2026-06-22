import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { parsedData, jobDescription } = await req.json();

    if (!parsedData) {
      return NextResponse.json({ error: "Missing parsedData" }, { status: 400 });
    }

    const jobContext = jobDescription 
      ? `Target Job Description:\n\n${jobDescription}\n\n`
      : "No specific job description provided — write a general, versatile cover letter.\n\n";

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert career coach and cover letter writer. Write a compelling, professional cover letter using the provided candidate resume data.' },
        { role: 'user', content: `${jobContext}Candidate Resume Data:\n\n${JSON.stringify(parsedData, null, 2)}\n\nGenerate a complete, ready-to-use cover letter. Only return the cover letter text.` },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const content = response.choices[0]?.message?.content;

    return NextResponse.json({ coverLetter: content });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
