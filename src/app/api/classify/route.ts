import { NextRequest, NextResponse } from 'next/server'
import PipelineSingleton from '@/object-detection/pipeline';
import { TextClassificationOutput } from '@huggingface/transformers';

export type ClassificationError = {
    error: string;
    status?: number;
};
export type ClassificationErrorResponse = NextResponse<ClassificationError>;

export async function GET(request: NextRequest) {
    const text = request.nextUrl.searchParams.get('text');
    if (!text) {
        return NextResponse.json({
            error: 'Missing text parameter',
        }, { status: 400 } as ClassificationErrorResponse);
    }
    try {
        const classifierPromise = await PipelineSingleton?.getInstance();
        if (!classifierPromise) {
            return NextResponse.json({
                error: 'Pipeline not initialized',
            }, { status: 500 } as ClassificationErrorResponse);
        }
        const result = await classifierPromise(text) as TextClassificationOutput;
        return NextResponse.json(result);
    } catch (error) {
        console.error('Classification failed:', error);
        return NextResponse.json({
            error: 'Classification failed',
        }, { status: 500 } as ClassificationErrorResponse);
    }
}

    // // Get the classification pipeline. When called for the first time,
    // // this will load the pipeline and cache it for future use.
    // const classifier = await (PipelineSingleton!).getInstance();

    // // Actually perform the classification
    // const result = await classifier(text);

    // return NextResponse.json(result);