import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with the provided API key
const API_KEY = 'AIzaSyDdik_qhqHsSjobemC0RAKiU6tq_0t9otQ';
const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings to filter out harmful content
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

// Get the Gemini Pro model
export const getGeminiProModel = () => {
    return genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        safetySettings,
    });
};

// Generate chat response
export async function generateChatResponse(messages: { role: string; content: string }[]) {
    try {
        const model = getGeminiProModel();
        const chat = model.startChat({
            history: messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
        });

        const result = await chat.sendMessage('');
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('Error generating chat response:', error);
        return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
}

// Generate code based on prompt and language
export async function generateCode(prompt: string, language: string) {
    try {
        const model = getGeminiProModel();
        const result = await model.generateContent(
            `Generate ${language} code for the following request: ${prompt}\n\nPlease provide only the code without explanations.`
        );
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating code:', error);
        return `// Error generating code\n// Please try again with a different prompt`;
    }
}

// Generate content based on parameters
export async function generateContent(params: {
    topic: string;
    contentType: string;
    tone: string;
    wordCount: string;
    keywords?: string;
}) {
    try {
        const { topic, contentType, tone, wordCount, keywords } = params;
        const keywordsPrompt = keywords ? `and include these keywords: ${keywords}` : '';

        const prompt = `Write a ${contentType} about "${topic}" in a ${tone} tone. 
    The content should be approximately ${wordCount} words ${keywordsPrompt}. 
    Format the output in Markdown.`;

        const model = getGeminiProModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        return `# Error Generating Content

Sorry, I encountered an error while generating content for "${params.topic}". Please try again with a different topic or parameters.`;
    }
}

// Define interfaces for task analysis
interface SubtaskAnalysis {
    title: string;
    priority: string;
    deadline: string;
    timeEstimate: string;
}

interface TaskAnalysisResult {
    category: string;
    priority: string;
    deadline: string;
    timeEstimate: string;
    subtasks: SubtaskAnalysis[];
}

// Generate resume based on user information
// Update the generateResume function to handle custom sections
export async function generateResume(params: {
    fullName: string;
    email: string;
    phone: string;
    summary: string;
    skills: string;
    experience: string;
    education: string;
    enabledSections?: {
        summary: boolean;
        skills: boolean;
        experience: boolean;
        education: boolean;
    };
    customSections?: { id: string; title: string; content: string }[];
    editedContent?: string; // Add support for pre-edited content
}) {
    try {
        // If there's edited content, return it directly without calling the API
        if (params.editedContent) {
            return params.editedContent;
        }

        const {
            fullName,
            email,
            phone,
            summary,
            skills,
            experience,
            education,
            enabledSections = { summary: true, skills: true, experience: true, education: true },
            customSections = []
        } = params;

        // Build the prompt based on enabled sections
        let prompt = `Create a professional resume in HTML format with the following information:
    - Full Name: ${fullName}
    - Contact: ${email} | ${phone}`;

        if (enabledSections.summary) {
            prompt += `\n    - Professional Summary: ${summary}`;
        }

        if (enabledSections.skills) {
            prompt += `\n    - Skills: ${skills} (comma-separated list of skills)`;
        }

        if (enabledSections.experience) {
            prompt += `\n    - Experience: ${experience}`;
        }

        if (enabledSections.education) {
            prompt += `\n    - Education: ${education} (comma-separated list of education entries, each should include degree, institution, and dates)`;
        }

        // Add custom sections to the prompt
        customSections.forEach(section => {
            if (section.title && section.content) {
                prompt += `\n    - ${section.title}: ${section.content}`;
            }
        });

        prompt += `\n    
    Format it professionally with clean spacing, clear section headers, and elegant formatting.
    Use proper indentation, bullet points for skills and achievements, and ensure consistent styling throughout.
    Make it visually appealing and well-structured for both human readers and ATS systems.
    Include horizontal rules to separate sections and use appropriate emphasis for important information.
    Format it like a real professional resume with proper spacing and layout.
    Use HTML tags for formatting (h1, h2, strong, ul, li, etc.) instead of Markdown.
    For the Education section, format each entry with the degree, institution name, and dates.
    The resume should look similar to a traditional professional resume with proper alignment and formatting.`;

        const model = getGeminiProModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating resume:', error);
        // Enhanced fallback template with better HTML formatting is handled in the page component
        throw error;
    }
}

// Generate summary of content
export async function generateSummary(content: string, wordCount: string = '150') {
    try {
        const model = getGeminiProModel();
        const result = await model.generateContent(
            `Summarize the following content in approximately ${wordCount} words:\n\n${content}`
        );
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating summary:', error);
        return `Error generating summary. Please try again with different content.`;
    }
}

// Generate task analysis and breakdown
export async function generateTaskAnalysis(taskDescription: string): Promise<TaskAnalysisResult> {
    try {
        const model = getGeminiProModel();
        const prompt = `You are a task analysis assistant. Analyze the following task and provide a detailed breakdown.
        
Task: ${taskDescription}

Provide a structured analysis following these EXACT guidelines:

1. Category: MUST be one of [Work, Personal, Health, Study, Shopping, Other]
2. Priority: MUST be one of [High, Medium, Low]
3. Deadline: Use relative time (e.g., "today", "tomorrow", "in 2 days", "next week")
4. Time Estimate: Use clear duration (e.g., "30 minutes", "2 hours", "1 day")
5. Subtasks: Break down complex tasks into 2-4 manageable steps

Your response MUST be a valid JSON object with this EXACT structure:
{
    "category": "<category>",
    "priority": "<priority>",
    "deadline": "<deadline>",
    "timeEstimate": "<estimate>",
    "subtasks": [
        {
            "title": "<subtask description>",
            "priority": "<subtask priority>",
            "deadline": "<subtask deadline>",
            "timeEstimate": "<subtask estimate>"
        }
    ]
}

Ensure all values are strings and the JSON is properly formatted.`;

        // Make up to 3 attempts to get a valid JSON response
        let attempts = 0;
        const maxAttempts = 3;
        let analysisResult: TaskAnalysisResult;

        while (attempts < maxAttempts) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const analysisText = response.text();

                // Attempt to parse and validate the JSON response
                analysisResult = JSON.parse(analysisText) as TaskAnalysisResult;

                // Validate required fields and format
                if (isValidTaskAnalysis(analysisResult)) {
                    return analysisResult;
                }
            } catch (parseError) {
                console.error(`Attempt ${attempts + 1} failed:`, parseError);
            }
            attempts++;
        }

        // Return default structure if all attempts fail
        return {
            category: 'Other',
            priority: 'Medium',
            deadline: 'today',
            timeEstimate: '1 hour',
            subtasks: []
        };
    } catch (error) {
        console.error('Error analyzing task:', error);
        return {
            category: 'Other',
            priority: 'Medium',
            deadline: 'today',
            timeEstimate: '1 hour',
            subtasks: []
        };
    }
}

// Helper function to validate task analysis response
function isValidTaskAnalysis(analysis: TaskAnalysisResult): boolean {
    const validCategories = ['Work', 'Personal', 'Health', 'Study', 'Shopping', 'Other'];
    const validPriorities = ['High', 'Medium', 'Low'];

    // Check main task fields
    if (!analysis.category || !validCategories.includes(analysis.category)) return false;
    if (!analysis.priority || !validPriorities.includes(analysis.priority)) return false;
    if (!analysis.deadline || typeof analysis.deadline !== 'string') return false;
    if (!analysis.timeEstimate || typeof analysis.timeEstimate !== 'string') return false;

    // Check subtasks if present
    if (analysis.subtasks && Array.isArray(analysis.subtasks)) {
        for (const subtask of analysis.subtasks) {
            if (!subtask.title || typeof subtask.title !== 'string') return false;
            if (!subtask.priority || !validPriorities.includes(subtask.priority)) return false;
            if (!subtask.deadline || typeof subtask.deadline !== 'string') return false;
            if (!subtask.timeEstimate || typeof subtask.timeEstimate !== 'string') return false;
        }
    }

    return true;
}
