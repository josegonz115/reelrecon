import { TextClassificationOutput } from '@huggingface/transformers';

export type ClassificationResponse = TextClassificationOutput;

export type ClassificationError = {
    error: string;
    status: number;
};
