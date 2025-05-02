import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  generateContent(message: string, apiKey: string): Observable<string | null> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const messageWithContext = `
    Celem tego zadania jest wygenerowanie danych projektu informatycznego do systemu Jira.

    Użytkownik poniżej podał opis projektu, który chce utworzyć. Na jego podstawie należy wygenerować strukturę danych w formacie JSON, zawierającą informacje o projekcie, epikach, zadaniach i sprintach.

    Ważne:
    - Jeśli opis użytkownika nie przypomina projektu informatycznego (np. jest niepoważny, niezgodny z celem aplikacji lub niezwiązany z IT), nie generuj żadnych danych. Zamiast tego zwróć:
      {
        "error": "Niepoprawny opis projektu. Spróbuj ponownie."
      }

    ---

    Opis projektu od użytkownika:
    "${message}"

    ---

    Zasady generowania:
    - Projekt ma być zgodny z metodyką Scrum.
    - Nazwa projektu powinna być kreatywna.
    - Sprint trwa 2 tygodnie.
    - Przyjmij dzisiejszą datę jako datę startową pierwszego sprintu (jeżeli użytkownik nie podał inaczej).
    - Załóż, że zespół developerski liczy 7 osób (jeżeli użytkownik nie podał inaczej).
    - Wygeneruj średnio od 2 do 4 zadań na osobę na cały projekt.
    - Uwzględnij w sumie 14-28 zadań (issues) w zależności od złożoności projektu.
    - Rozbij zadania na szczegółowe kroki techniczne i funkcjonalne.
    - Preferuj większą liczbę mniejszych, konkretnych zadań zamiast małej liczby ogólnych.
    - Opisy zadań powinny być bogate w kontekst: technologia, sposób implementacji, oczekiwany rezultat.
    - Rozdziel zadania między epiki i sprinty w sposób równomierny.
    - Każdy epik ma przypisane co najmniej 2-3 zadania.
    - Każdy sprint powinien zawierać realistyczną liczbę zadań (6-10).

    Typy issue:
    - Story (10006),
    - Task (10007) - zadania techniczne (nie więcej niż 20% sprintu),
    - Epic (10000).

    Każdy issue powinien zawierać:
    - summary (max 30 znaków),
    - description (rozbudowany, opisujący co należy zrobić),
    - priority (1-Highest do 5-Lowest) — wybierz adekwatnie na podstawie treści.

    Struktura JSON ma zawierać 4 główne bloki:

    1. "project": {
       "key": string,
       "name": string (max 30 znaków),
       "description": string
    }

    2. "epics": [
       {
         "geminiId": string,
         "issuesGeminiIds": [string],
         "fields": {
           "issuetype": number,
           "summary": string (max 30 znaków),
           "description": string,
           "priority": number
         }
       },
       ...
    ]

    3. "issues": [
       {
         "geminiId": string,
         "fields": {
           "issuetype": number,
           "summary": string (max 30 znaków),
           "description": string,
           "priority": number
         }
       },
       ...
    ]

    4. "sprints": [
       {
         "name": string (max 30 znaków),
         "startDate": string(ISO),
         "endDate": string(ISO),
         "goal": string (max 30 znaków),
         "issuesGeminiIds": [string]
       },
       ...
    ]

    ---

    Wygeneruj pełny zestaw danych. Odpowiedź ma zawierać wyłącznie czysty JSON, bez komentarzy, opisu, formatowania Markdown ani kodu.
    `;

    const resultPromise = model.generateContent(messageWithContext);
    return from(resultPromise).pipe(
      map(response => response.response?.text() || null)
    );
  }
}
