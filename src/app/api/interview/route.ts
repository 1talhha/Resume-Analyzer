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
      : 'General Interview Prep based only on resume.\n\n';

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert technical recruiter and interviewer. Generate 5 highly specific and challenging interview questions based on the provided candidate resume data. Return ONLY valid JSON format containing an array of questions.' },
        { role: 'user', content: `${jobContext}Candidate Resume Data:\n\n${JSON.stringify(parsedData, null, 2)}\n\nGenerate exactly 5 interview questions. \n\nExpected JSON format: { "questions": [ { "question": "The question text", "why": "Why this question is relevant to their resume", "tips": "Tips on how to answer" } ] }` },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content");

    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json/i, '').replace(/```$/, '').trim();
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const data = JSON.parse(cleanedContent);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 });
  }
}
