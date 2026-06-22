# 🚀 AI Resume Analyzer

An intelligent, full-featured resume analysis tool powered by **LLaMA 3** (via Groq) and **Next.js**. Upload your resume and instantly get deep AI-driven insights, ATS compatibility scoring, skill gap analysis, a tailored cover letter, and mock interview questions — all in one beautiful interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Resume Analysis** | Extracts key information: name, role, skills, experience, education, and more |
| 🎯 **ATS Score & Job Matching** | Paste a job description to get an ATS compatibility score and keyword gap analysis |
| 💡 **Actionable Feedback** | AI comments on resume formatting, structure, and suitability |
| 🔍 **Skill Gap Analysis** | Identifies missing skills based on your target role or job description |
| ✉️ **AI Cover Letter Generator** | Generates a complete, tailored cover letter based on your resume and target job |
| 🎤 **Mock Interview Prep** | Generates 5 personalized interview questions with tips on how to answer them |
| 💾 **MongoDB Storage** | Saves every analysis result to MongoDB for future reference |

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [Tailwind CSS v3](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **AI Engine**: [Groq SDK](https://console.groq.com/) with **LLaMA 3.3 70B Versatile**
- **PDF Parsing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📸 Screenshots

> Upload your resume, optionally paste a job description, and click **Analyze Resume**.

The results dashboard includes 4 tabs:
1. **Overview & Score** — Resume strength score, extracted skills, experience timeline, education
2. **Actionable Feedback** — AI feedback, skill gaps, formatting suggestions
3. **AI Cover Letter** — Ready-to-use, fully generated cover letter
4. **Mock Interview Prep** — 5 personalized interview Q&As

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Groq API Key](https://console.groq.com/) (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/resume-analyzer.git
   cd resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create your environment file**

   Create a `.env.local` file in the root of the project:
   ```env
   # Groq API Key — get one free at https://console.groq.com
   GROQ_API_KEY=your_groq_api_key_here

   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/resume_analyzer
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key for LLaMA 3 access |
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |

---

## 📁 Project Structure

```
resume-analyzer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/       # Core resume analysis endpoint
│   │   │   ├── cover-letter/  # AI cover letter generation
│   │   │   └── interview/     # Mock interview question generation
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Main landing page
│   ├── components/
│   │   ├── ResumeUploader.tsx # Drag-and-drop PDF upload component
│   │   └── AnalysisResults.tsx # Results dashboard with tabs
│   ├── lib/
│   │   ├── db.ts              # MongoDB connection utility
│   │   └── groq.ts            # Groq AI service & prompts
│   └── models/
│       ├── User.ts            # User Mongoose schema
│       └── AnalysisResult.ts  # Analysis result Mongoose schema
├── .env.local                 # Environment variables (not committed)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🔌 API Reference

### `POST /api/analyze`
Analyzes a resume PDF file.

**Request**: `multipart/form-data`
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | `File` | ✅ | PDF resume file |
| `jobDescription` | `string` | ❌ | Target job description for ATS scoring |

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "role": "Software Engineer",
    "resumeStrength": 78,
    "atsScore": 85,
    "skills": ["React", "Node.js", "..."],
    "skillGaps": ["Docker", "Kubernetes"],
    "careerHistory": [...],
    "education": [...],
    "botComments": "Strong candidate...",
    "formattingFeedback": "Consider adding metrics..."
  },
  "recordId": "mongo_object_id"
}
```

### `POST /api/cover-letter`
Generates a tailored cover letter.

**Request**: `application/json`
```json
{ "parsedData": { ... }, "jobDescription": "optional job description" }
```

### `POST /api/interview`
Generates mock interview questions.

**Request**: `application/json`
```json
{ "parsedData": { ... }, "jobDescription": "optional job description" }
```

---

## ⚠️ Known Issues & Notes

- The app uses **Webpack** mode (`next dev --webpack`) due to a known issue with Turbopack native bindings on Windows. This is already configured in `package.json`.
- `pdf-parse` is configured as a `serverExternalPackage` to prevent Webpack from bundling it incorrectly.
- The hydration mismatch warning in the browser console is caused by browser extensions injecting attributes into the DOM and is completely harmless.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Groq](https://groq.com/) for the blazing-fast LLaMA 3 inference API
- [Meta AI](https://ai.meta.com/) for the open-source LLaMA 3 model
- [Vercel](https://vercel.com/) for the amazing Next.js framework
