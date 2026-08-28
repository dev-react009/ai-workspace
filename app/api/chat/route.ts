import {NextResponse} from "next/server";
import groqClient from "../../lib/groq";


export async function POST(request:Request){
    const body = await request.json();

    const chtCompletions = await groqClient.chat.completions.create({
        model:"llama-3.1-8b-instant",
        messages:[
            {
                role:"system",
                content:`You are a helpful assistant.
                
                Rules:
                - Answer in simple  English.
                - Provide code examples when possible.
                - Explain concepts in a clear and concise manner.
                - Don't use complex words or jargon.
                - Keep the responses short and to the point.
                `
            },
            {
                role:"user",
                content:body.message
            }
        ],
    });

    const aiResponse = chtCompletions.choices[0].message.content;

    return NextResponse.json({
        message: aiResponse
    })
}