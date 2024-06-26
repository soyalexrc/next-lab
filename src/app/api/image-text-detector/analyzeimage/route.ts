import {NextRequest, NextResponse} from "next/server";
import {generateObject} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {z} from 'zod';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


export async function POST(req: NextRequest) {
    try {

        const {image} = await req.json();
        const {object} = await generateObject({
            mode: 'json',
            model: openai('gpt-4o'),
            maxTokens: 4096,
            schema: z.object({
                price: z.string(),
                date: z.string(),
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
        console.log(typeof object);

        return NextResponse.json(object);
    } catch (error) {
        return NextResponse.json(error);
    }

    // const stream = OpenAIStream(response);
}
