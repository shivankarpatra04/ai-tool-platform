import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy for the NVIDIA NIM (OpenAI-compatible) chat completions API.
// The API key is read from environment variables and is never sent to the browser.

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const NVIDIA_BASE_URL =
    process.env.NVIDIA_BASE_URL ?? 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL ?? 'meta/llama-3.1-8b-instruct';

export async function POST(request: NextRequest) {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'NVIDIA_API_KEY is not configured on the server.' },
            { status: 500 }
        );
    }

    let body: { messages?: ChatMessage[]; temperature?: number; maxTokens?: number };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { messages, temperature = 0.7, maxTokens = 1024 } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
            { error: '`messages` must be a non-empty array.' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(NVIDIA_BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                model: NVIDIA_MODEL,
                messages,
                temperature,
                max_tokens: maxTokens,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            return NextResponse.json(
                { error: `NVIDIA API error ${response.status}: ${errorBody}` },
                { status: 502 }
            );
        }

        const data = await response.json();
        const raw: string = data?.choices?.[0]?.message?.content ?? '';
        // Reasoning models (e.g. nemotron-ultra) may wrap their internal
        // chain-of-thought in <think>…</think>; strip it before returning.
        const content = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        return NextResponse.json({ content });
    } catch (error) {
        console.error('NVIDIA proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to reach the NVIDIA API.' },
            { status: 502 }
        );
    }
}
