import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function parseResume(resumeText: string, jobDescription?: string) {
  const jobContext = jobDescription 
    ? `Given the following job description:\n\n${jobDescription}\n\n` 
    : '';

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are an expert ATS (Applicant Tracking System) and professional resume parser. Extract key details and provide actionable feedback. Return ONLY valid JSON.' },
      { role: 'user', content: `${jobContext}Extract the following fields from the resume:\n\n{
        "name": "string",
        "email": "string",
        "phone": "string",
        "role": "string",
        "location": "string",
        "linkedinLink": "string",
        "resumeStrength": "number (0-100)",
        "atsScore": "number (0-100, calculate match with job description if provided, otherwise estimate ATS friendliness)",
        "botComments": "string (Actionable feedback on how to improve the resume)",
        "skillGaps": ["string (skills missing based on the role or job description)"],
        "careerHistory": [{"company": "string", "role": "string", "startDate": "string", "endDate": "string", "description": "string"}],
        "skills": ["string"],
        "experienceYears": "number",
        "education": [{"institution": "string", "degree": "string", "fieldOfStudy": "string", "graduationYear": "string"}],
        "formattingFeedback": "string (Comments on length, action verbs, layout)"
      }.\n\nReturn ONLY a JSON object that exactly matches the provided schema.` },
      { role: 'user', content: `Resume Text:\n\n${resumeText}` },
    ],
    model: 'llama-3.3-70b-versatile',
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from Groq.");

  try {
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json/i, '').replace(/```$/, '').trim();
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```/, '').replace(/```$/, '').trim();
    }
    
    if (!cleanedContent.startsWith('{') && cleanedContent.includes('{')) {
       const startIndex = cleanedContent.indexOf('{');
       const endIndex = cleanedContent.lastIndexOf('}');
       if (startIndex !== -1 && endIndex !== -1) {
         cleanedContent = cleanedContent.substring(startIndex, endIndex + 1);
       }
    }

    return JSON.parse(cleanedContent);
  } catch (jsonError: any) {
    console.error('Invalid JSON returned from Groq. Raw content:', content);
    throw new Error(`AI generated invalid JSON: ${jsonError.message}`);
  }
}
