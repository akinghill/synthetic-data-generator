
import { NextResponse } from 'next/server';
import { PRESETS } from '@/lib/presets';

// Allow configuration via env vars
const API_URL = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json(
            { error: 'LLM API Key not configured' },
            { status: 500 }
        );
    }

    try {
        const { presetId, quantity } = await req.json();

        if (!presetId || !quantity) {
            return NextResponse.json(
                { error: 'Missing presetId or quantity' },
                { status: 400 }
            );
        }

        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) {
            return NextResponse.json(
                { error: 'Invalid presetId' },
                { status: 400 }
            );
        }

        const prompt = `${preset.systemPrompt}\n\nQuantity needed: ${quantity}`;

        // Helper to call LLM
        const callLLM = async (messages: any[]) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: messages,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`LLM API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        };

        let content = "";
        try {
            content = await callLLM([{ role: 'system', content: prompt }]);
        } catch (e: any) {
            console.error("LLM Call Failed:", e);
            return NextResponse.json({ error: e.message }, { status: 502 });
        }

        // Try parsing
        try {
            const json = JSON.parse(content);
            return NextResponse.json(json);
        } catch (e) {
            console.warn("JSON Parse failed, retrying once...");
            // Retry once with error message
            try {
                const fixedContent = await callLLM([
                    { role: 'system', content: prompt },
                    { role: 'assistant', content: content },
                    { role: 'user', content: "The previous output was not valid JSON. Please fix it and output ONLY raw JSON." }
                ]);
                const fixedJson = JSON.parse(fixedContent);
                return NextResponse.json(fixedJson);
            } catch (retryError) {
                console.error("Retry failed:", retryError);
                return NextResponse.json(
                    { error: 'Failed to generate valid JSON after retry', raw: content },
                    { status: 500 }
                );
            }
        }

    } catch (error) {
        console.error('SERVER ERROR:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
