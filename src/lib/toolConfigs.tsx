import type { ComponentType, SVGProps } from 'react';
import {
  UserIcon,
  ChatIcon,
  SendIcon,
  MegaphoneIcon,
  ClipboardIcon,
  DocumentIcon,
  CalendarIcon,
  LightbulbIcon,
  BracesIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  GitBranchIcon,
} from '@/components/ui/icons';

/** A single input rendered in a tool's form. */
export interface ToolField {
  name: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
  optional?: boolean;
}

/**
 * Declarative definition of a micro AI tool. The shared ToolRunner renders the
 * form from `fields`, sends `systemPrompt` + the collected input to the NVIDIA
 * proxy, and displays the markdown result. Adding a tool is just a new entry
 * here — no new page or component required.
 */
export interface ToolConfig {
  slug: string;
  name: string;
  short: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradient: string;
  systemPrompt: string;
  fields: ToolField[];
  submitLabel?: string;
  temperature?: number;
  maxTokens?: number;
}

export const toolConfigs: ToolConfig[] = [
  {
    slug: 'bio-generator',
    name: 'Bio Generator',
    short: 'Bio Generator',
    description: 'Generate LinkedIn, Twitter, and portfolio bios from a few details.',
    Icon: UserIcon,
    gradient: 'from-sky-500 to-indigo-500',
    temperature: 0.75,
    maxTokens: 1024,
    fields: [
      { name: 'name', label: 'Your name', type: 'text', placeholder: 'e.g. Ada Lovelace' },
      { name: 'title', label: 'Job title', type: 'text', placeholder: 'e.g. Software Engineer' },
      {
        name: 'keywords',
        label: '3 keywords that describe you',
        type: 'text',
        placeholder: 'e.g. creative, analytical, driven',
      },
    ],
    systemPrompt: `You are a professional bio writer. Return exactly 3 bios:
1. LinkedIn Bio (100 words)
2. Twitter Bio (30 words)
3. Portfolio Bio (60 words)

Format each with a clear markdown heading (## ). Use the provided name, job title, and keywords to personalize each bio. Return only the bios, no preamble.`,
  },
  {
    slug: 'thread-maker',
    name: 'Twitter Thread Maker',
    short: 'Thread Maker',
    description: 'Turn a blog post or article into an engaging numbered X/Twitter thread.',
    Icon: ChatIcon,
    gradient: 'from-violet-500 to-fuchsia-500',
    temperature: 0.7,
    maxTokens: 1536,
    fields: [
      {
        name: 'content',
        label: 'Article or blog post',
        type: 'textarea',
        placeholder: 'Paste the content you want to turn into a thread…',
      },
    ],
    systemPrompt: `Convert the provided content into a Twitter/X thread:
- Tweet 1: a strong hook that grabs attention
- Tweets 2-8: one key point per tweet, each under 280 characters
- Final tweet: a clear Call To Action (CTA)

Number each tweet (e.g. "1/"). Use simple, engaging language. Do not use hashtags unless they fit naturally. Format each tweet as its own short paragraph beginning with its number.`,
  },
  {
    slug: 'cold-email-writer',
    name: 'Cold Email Writer',
    short: 'Cold Email Writer',
    description: 'Write three cold email variants: ultra-short, value-first, and pain-point.',
    Icon: SendIcon,
    gradient: 'from-amber-500 to-orange-500',
    temperature: 0.75,
    maxTokens: 1280,
    fields: [
      { name: 'company', label: 'Target company', type: 'text', placeholder: 'e.g. Acme Corp' },
      { name: 'role', label: "Recipient's job role", type: 'text', placeholder: 'e.g. Head of Marketing' },
      {
        name: 'product',
        label: 'Your product or service',
        type: 'textarea',
        placeholder: 'Briefly describe what you offer and the value it provides…',
      },
    ],
    systemPrompt: `Write 3 cold email variants:
1. Ultra-Short: 5 lines max, direct ask
2. Value-First: lead with ROI or benefit, then pitch
3. Pain-Point: open with a problem they likely face, then offer the solution

Each email must include:
- A compelling subject line (in **bold**)
- A personalized opening using the company name and recipient role
- A body under 120 words
- A clear CTA at the end

Separate each variant with a clear markdown heading.`,
  },
  {
    slug: 'headline-generator',
    name: 'Headline Generator',
    short: 'Headline Generator',
    description: 'Get 10 grouped headline options for any blog topic or product.',
    Icon: MegaphoneIcon,
    gradient: 'from-rose-500 to-pink-500',
    temperature: 0.8,
    maxTokens: 1024,
    fields: [
      {
        name: 'topic',
        label: 'Blog topic or product name',
        type: 'text',
        placeholder: 'e.g. A productivity app for remote teams',
      },
    ],
    systemPrompt: `Generate exactly 10 headline options grouped as:
1. Curiosity (2 headlines)
2. How-To (2 headlines)
3. Listicle (2 headlines)
4. Bold Claim (2 headlines)
5. Question-Based (2 headlines)

Label each group with a clear markdown heading and list its headlines as a numbered list. Make every headline specific, compelling, and under 70 characters. Avoid vague or generic phrasing.`,
  },
  {
    slug: 'meeting-summarizer',
    name: 'Meeting Notes Summarizer',
    short: 'Meeting Summarizer',
    description: 'Turn raw meeting notes into decisions, action items, and a summary.',
    Icon: ClipboardIcon,
    gradient: 'from-emerald-500 to-teal-500',
    temperature: 0.4,
    maxTokens: 1536,
    fields: [
      {
        name: 'notes',
        label: 'Meeting notes or transcript',
        type: 'textarea',
        placeholder: 'Paste the raw notes or transcript…',
      },
    ],
    systemPrompt: `Summarize the provided meeting notes into exactly 4 sections, each with a markdown heading:
1. Key Decisions - a bullet list of what was decided
2. Action Items - a list using the format: [Task] -> [Owner] -> [Deadline if stated]
3. Open Questions - unresolved topics from the meeting
4. Executive Summary - one clear paragraph, 3-5 sentences

Use clean formatting. Be concise and factual. Do not invent details that are not present in the notes.`,
  },
  {
    slug: 'resume-bullet-rewriter',
    name: 'Resume Bullet Rewriter',
    short: 'Resume Bullets',
    description: 'Rewrite weak resume bullets using the STAR method with metrics.',
    Icon: DocumentIcon,
    gradient: 'from-cyan-500 to-blue-500',
    temperature: 0.5,
    maxTokens: 1024,
    fields: [
      {
        name: 'bullets',
        label: 'Resume bullet points (one per line)',
        type: 'textarea',
        placeholder: 'Responsible for managing the team\nWorked on the website redesign\nHelped with customer support',
      },
    ],
    systemPrompt: `Rewrite each resume bullet using the STAR method:
- Start with a strong past-tense action verb
- Add specific, quantifiable results
- Use placeholders like [X%] or [$Y] when metrics are unknown but logically applicable
- Keep each bullet under 20 words

Return the rewritten bullets as a numbered list in the same order as the input. Output only the rewritten versions.`,
  },
  {
    slug: 'weekly-planner',
    name: 'Weekly Planner',
    short: 'Weekly Planner',
    description: 'Turn your goals and available hours into a prioritized weekly plan.',
    Icon: CalendarIcon,
    gradient: 'from-indigo-500 to-violet-500',
    temperature: 0.5,
    maxTokens: 1536,
    fields: [
      {
        name: 'goals',
        label: 'Goals for the week',
        type: 'textarea',
        placeholder: 'e.g. Ship the landing page, prepare investor deck, exercise 3x…',
      },
      {
        name: 'hours',
        label: 'Available hours per day',
        type: 'textarea',
        placeholder: 'e.g. Mon: 4hrs, Tue: 6hrs, Wed: 3hrs, Thu: 5hrs, Fri: 4hrs',
      },
    ],
    systemPrompt: `Create a structured weekly plan from the user's goals and available hours:
- Assign each goal to specific days based on the available hours
- Label each task as High / Medium / Low priority
- Break big goals into smaller daily sub-tasks
- Add one "buffer slot" per day for unexpected work
- Format as a day-by-day schedule (Monday-Friday) using a markdown heading per day and a list of time-blocked tasks

Keep the tone motivating but realistic.`,
  },
  {
    slug: 'eli5-explainer',
    name: "Explain Like I'm 5",
    short: 'ELI5 Explainer',
    description: 'Explain any complex topic at three levels: child, teen, and expert.',
    Icon: LightbulbIcon,
    gradient: 'from-fuchsia-500 to-purple-500',
    temperature: 0.7,
    maxTokens: 1024,
    fields: [
      {
        name: 'topic',
        label: 'Topic to explain',
        type: 'text',
        placeholder: 'e.g. quantum computing, blockchain, neural networks',
      },
    ],
    systemPrompt: `Explain the provided topic at exactly 3 levels, each with a clear markdown heading:

## Level 1 - For a 6-year-old
Use a simple real-world analogy. Maximum 3 sentences.

## Level 2 - For a teenager
Use relatable modern examples. Maximum 5 sentences. Introduce the correct terminology once.

## Level 3 - For an expert
Use precise technical language. Maximum 4 sentences. Assume deep domain knowledge.`,
  },
  {
    slug: 'regex-generator',
    name: 'Regex Generator',
    short: 'Regex Generator',
    description: 'Describe what to match in plain English and get a tested regex pattern.',
    Icon: BracesIcon,
    gradient: 'from-teal-500 to-emerald-600',
    temperature: 0.3,
    maxTokens: 1280,
    fields: [
      {
        name: 'description',
        label: 'What should the regex match?',
        type: 'textarea',
        placeholder: 'e.g. a valid Indian mobile number starting with 6, 7, 8, or 9 and exactly 10 digits',
      },
    ],
    systemPrompt: `Return the following, using markdown:
1. The exact regex pattern inside a fenced code block (use \`\`\`regex)
2. A breakdown table explaining each part of the regex in plain English (a markdown table with the columns: Token | Meaning)
3. Three test examples:
   - 2 strings that MATCH the pattern
   - 1 string that FAILS, and why

Use standard regex syntax compatible with JavaScript, Python, and Java.`,
  },
  {
    slug: 'sql-query-builder',
    name: 'SQL Query Builder',
    short: 'SQL Builder',
    description: 'Describe the data you need and get a ready-to-run SQL query with explanation.',
    Icon: DatabaseIcon,
    gradient: 'from-blue-500 to-indigo-600',
    temperature: 0.3,
    maxTokens: 1280,
    fields: [
      {
        name: 'description',
        label: 'Describe the data you need',
        type: 'textarea',
        placeholder: 'e.g. show the top 10 customers by total orders placed in the last 30 days',
      },
    ],
    systemPrompt: `Return the following, using markdown:
1. A clean, ready-to-run SQL query in a fenced \`\`\`sql code block
2. A line-by-line explanation of what each clause does (SELECT, FROM, WHERE, etc.) as a numbered list
3. One index optimization tip, if applicable
4. Any assumptions made about table or column names

Use standard PostgreSQL syntax unless the user specifies a different database.`,
  },
  {
    slug: 'code-reviewer',
    name: 'Code Reviewer',
    short: 'Code Reviewer',
    description: 'Get a severity-grouped review of any code snippet with fixes.',
    Icon: ShieldCheckIcon,
    gradient: 'from-red-500 to-rose-600',
    temperature: 0.3,
    maxTokens: 2048,
    fields: [
      {
        name: 'code',
        label: 'Code to review',
        type: 'textarea',
        placeholder: 'Paste a code snippet in any language…',
      },
    ],
    systemPrompt: `Review the provided code and organize findings into 3 labeled severity sections, each a markdown heading:

## 🔴 CRITICAL - bugs, security vulnerabilities, data loss risks
## 🟡 WARNING - performance issues, deprecated methods, bad practices
## 🟢 SUGGESTION - style improvements, readability, refactoring opportunities

For each finding:
- Quote the exact problematic line in a code block
- Explain why it is an issue
- Show a corrected version in a code block

If a severity level has no issues, write: "✅ No issues found." Detect the programming language automatically. Begin your response with a one-line summary of the total issue count.`,
  },
  {
    slug: 'git-commit-writer',
    name: 'Git Commit Message Writer',
    short: 'Commit Writer',
    description: 'Generate Conventional Commits messages from a diff or change description.',
    Icon: GitBranchIcon,
    gradient: 'from-orange-500 to-amber-600',
    temperature: 0.4,
    maxTokens: 1280,
    fields: [
      {
        name: 'diff',
        label: 'Git diff or change description',
        type: 'textarea',
        placeholder: 'Paste a git diff, or describe what changed in plain English…',
      },
    ],
    systemPrompt: `Generate 5 commit message options following the Conventional Commits specification:

1. feat: - a new feature added
2. fix: - a bug fix
3. refactor: - code restructure, no behavior change
4. chore: - maintenance, dependencies, config
5. docs: - documentation changes

For each, provide:
- Short version: under 72 characters, format TYPE(scope): description (show it in an inline code span)
- Long version: a short title + a blank line + a detailed body paragraph explaining what and why (show it in a fenced code block)

Use the imperative mood ("add", "fix", "update", not "added", "fixed", "updated"). Use a markdown heading for each of the 5 types.`,
  },
];
