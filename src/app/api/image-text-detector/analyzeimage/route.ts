import {NextRequest, NextResponse} from "next/server";
import {generateObject} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import {z} from 'zod';

export const runtime = 'edge';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


export async function POST(req: NextRequest) {
    const { image } = await req.json();
    console.log(image);
    const { object } = await generateObject({
        mode: 'json',
        model: openai('gpt-4o'),
        maxTokens: 4096,
        schema: z.object({
            price: z.string(),
            date: z.date(),
            time: z.string(),
            clinic: z.string(),
            address: z.string(),
            user: z.string(),
            receipt_number: z.string(),
            patient: z.string(),
            hc_number: z.string(),
            service: z.string(),
            quantity: z.string(),
            unit_price: z.string(),
            total_price: z.string(),
            amount_received: z.string(),
            change: z.string(),
            ticket_number: z.string(),
            appointment_date: z.string(),
            appointment_time: z.string()
        }),
        messages: [
            {
                role: 'user',
                content: 'Please generate an object with the data available in the following ticket.'
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'image',
                        image
                    }
                ]
            }
        ]
    });

    console.log(object);

    return NextResponse.json(object);

    // const stream = OpenAIStream(response);
}
