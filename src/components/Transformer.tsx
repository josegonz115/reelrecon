'use client'

import { ClassificationErrorResponse } from '@/app/api/classify/route';
import { ClassificationError, ClassificationResponse } from '@/types/api';
import { useState } from 'react'

export default function Transformer() {

  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const [error, setError] = useState<ClassificationError | null>(null);

  const isClassificationError = (data: any): data is ClassificationError => {
    return 'error' in data;
  };
  const classify = async (text:string | undefined) => {
    if (!text) return;
    if (ready === null) setReady(false);
    const result = await fetch(`/api/classify?text=${encodeURIComponent(text)}`);
    if (!ready) setReady(true);
    const json = await result.json();
    if(isClassificationError(json)){
      setError(json);
    }else{
      setResult(json);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">Transformers.js</h1>
      <h2 className="text-2xl mb-4 text-center">Next.js template (server-side)</h2>
      <input
        type="text"
        className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter text here"
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          classify((e.target as HTMLInputElement).value);
        }}
      />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">{error.error}</p>
          <p className="text-sm">Status: {error.status}</p>
        </div>
      )}
      {ready !== null && (
        <pre className="bg-gray-100 p-2 rounded text-black">
          {
            (!ready || !result) ? 'Loading...' : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}