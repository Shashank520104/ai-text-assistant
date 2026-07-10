# Shaurya AI

An AI-powered career assistant and resume analysis platform built with React, Node.js, Express.js and Google Gemini.

Shaurya AI combines a multi-mode conversational assistant with an intelligent resume analyzer that accepts PDF resumes, extracts their text, evaluates them against a target job role and returns a structured ATS analysis.

![Shaurya AI Resume Analyzer](./screenshots/resume-analysis-result.png)

## Features

### AI Assistant

- Placement mentor
- AI interviewer
- Coding assistant
- Content and email generation
- LinkedIn post generation
- Code review and bug fixing
- Career roadmap guidance
- Project recommendations
- Startup idea validation

### AI Resume Analyzer

- PDF resume upload
- PDF-only file validation
- Resume text extraction
- Target-role-based ATS analysis
- Structured JSON response
- ATS score from 0 to 100
- Strength and weakness detection
- Missing keyword identification
- Actionable improvement feedback
- Zod schema validation
- Temporary file cleanup

## Screenshots

### AI Assistant

![AI Assistant](./screenshots/Screenshot%20(100).png)

### Resume Upload

![Resume Upload](./screenshots/Screenshot%20(102).png)

### Resume Analysis

![Resume Analysis Result](./screenshots/Screenshot%20(104).png)

### Responsive Interface

![Mobile Responsive UI](./screenshots/Screenshot%20(106).png)

## System Architecture

```text
React Frontend
       │
       ▼
Express Routes
       │
       ▼
Middleware
       │
       ├── CORS
       └── Multer File Upload
       │
       ▼
Controllers
       │
       ▼
Feature Services
       │
       ├── AI Chat Service
       └── Resume Analysis Service
       │
       ├── PDF Text Extraction
       ├── Prompt Construction
       ├── Gemini AI Client
       ├── JSON Parsing
       └── Zod Validation
       │
       ▼
Structured Frontend Response
```

## Resume Analysis Pipeline

```text
PDF Upload
    │
    ▼
Multer Validation
    │
    ▼
Temporary File Storage
    │
    ▼
PDF Text Extraction
    │
    ▼
Production ATS Prompt
    │
    ▼
Google Gemini
    │
    ▼
JSON Parsing
    │
    ▼
Zod Schema Validation
    │
    ▼
Temporary File Cleanup
    │
    ▼
React Result Cards
```

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- ES Modules
- Multer
- pdf-parse
- Zod

### AI

- Google Gemini API
- Structured prompt engineering
- Schema-validated AI responses

### Development Tools

- Git
- GitHub
- Postman / cURL
- Visual Studio Code
- GitHub Copilot

## Project Structure

```text
ai-text-assistant/
│
├── client/
│   └── src/
│       ├── components/
│       ├── constants/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── App.css
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── memory/
│   ├── middleware/
│   ├── prompts/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── uploads/
│   └── server.js
│
├── screenshots/
└── README.md
```

## API Endpoints

### Health Check

```http
GET /check
```

### AI Chat

```http
POST /ai/chat
```

Example request:

```json
{
  "conversation": [
    {
      "role": "user",
      "text": "How should I prepare for an AI full-stack internship?"
    }
  ],
  "mode": "mentor"
}
```

### Get Chat History

```http
GET /ai/history
```

### Clear Chat History

```http
DELETE /ai/history
```

### Analyze Resume

```http
POST /resume/resume-analysis
```

Request format:

```text
multipart/form-data
```

Fields:

```text
resume  → PDF file
jobRole → Target job role
```

Example response:

```json
{
  "success": true,
  "data": {
    "ats_score": 84,
    "verdict": "Good",
    "strengths": [
      "Strong React and Node.js experience",
      "Relevant AI project development"
    ],
    "weaknesses": [
      "Limited cloud deployment experience"
    ],
    "missing_keywords": [
      "Docker",
      "AWS",
      "CI/CD"
    ],
    "improvement_tip": "Add measurable project impact and deployment experience."
  }
}
```

## Local Installation

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd ai-text-assistant
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create:

```text
server/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=8000
```

Never commit `.env` to GitHub.

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Configure the frontend API URL

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

### 7. Start the frontend

```bash
npm run dev
```

## Engineering Concepts Demonstrated

- Layered backend architecture
- Routes, controllers and services
- Single Responsibility Principle
- Separation of Concerns
- DRY principle
- AI client abstraction
- Prompt engineering
- Structured AI output
- Defensive programming
- Zod schema validation
- Multipart file uploads
- PDF document processing
- Temporary resource cleanup
- Responsive React UI
- Centralized frontend API service

## Security Considerations

- API keys are stored in environment variables
- Only PDF uploads are accepted
- AI responses are validated before frontend use
- Uploaded files are deleted after processing
- Invalid requests are rejected before business processing

## Future Improvements

- JWT authentication and user accounts
- MongoDB-based user and resume history
- Interview simulator
- Saved resume reports
- AI usage limits
- Rate limiting
- Docker deployment
- Automated testing
- Cloud storage
- RAG-based career knowledge assistant

## Learning Outcomes

While building Shaurya AI, I learned how to:

- Design modular AI full-stack architecture
- Build reusable AI client services
- Process uploaded PDF documents
- Create predictable structured AI responses
- Validate probabilistic model output
- Separate frontend, API and business responsibilities
- Handle temporary files and backend failures safely

## Author

**Shashank Kumar**

B.Tech Computer Science Engineering student at Bennett University.

- GitHub: https://github.com/Shashank520104/ai-text-assistant

- LinkedIn: www.linkedin.com/in/shashank-kumar-a40a872a0

- Email: 05shashankkr@gmail.com

## Disclaimer

ATS scores generated by Shaurya AI are AI-assisted estimates intended for resume improvement and do not represent the proprietary scoring systems of individual employers.