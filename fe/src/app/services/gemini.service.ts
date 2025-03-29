import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  generateContent(prompt: string, apiKey: string): Observable<string | null> {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const promptWithContext = `You are a helpful assistant.  Answer the following question concisely: ${prompt}`;

    const resultPromise = model.generateContent(promptWithContext);
    return from(resultPromise).pipe(
      map(response => response.response?.text() || null)
    );
  }
}
