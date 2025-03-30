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

    const promptWithContext =
      `
      ${prompt}.
      Użytkownik chce założyć projekt w JIRA poprzez REST API.
      Będzie potrzebował zestawu danych, żeby przesłać je do API.

      Stwórz JSON z projektem. Wypełnij potrzebne pola.

      Stwórz od jednej do kilku epic. Nadaj im nazwy adekwatne do projektu.

      Stwórz odpowiednią a by zrealizować cały projekt ilość zadań (issues).
      Dodaj do epic adekwatne issues.
      Issue mogą mieć typ: Story, Task
      Task to zadanie techniczne jak konfiguracja, założenie bazy danych itp.
      Nie powinno być więcej niż 20% tasków w sprincie.

      Issue powinny mieć różne priority. Na podstawie nazwy i innych informacji o issue, zdecyj jakie powienien mieć priority.
      Możliwe typy priority: Highest, High, Medium, Low, Lowest

      Jeżeli użytkownik nie podał daty startu projektu, to projekt startuje dzisiaj.
      Sprint trwa 2 tygodnie.
      Załóż kilka sprintów. Oszacuj ile sprintów potrzeba na zrealizowanie projektu.
      Dodaj do tych sprintów id stworzonych issues (bez epiców)

      Proszę o zwrócenie informacji formacie JSON.
      Informacje powinny zawierać następujące klucze:

      "project":
      {
        key,
        name,
        description
      },
      "issues":
        {
          "issue":
          {
            geminiId,
            "fields":
            {
              issuetype,
              summary,
              description,
              issuepriority,
              created
            }
          }
        },
      "epics":
      {
        "issue":
        {
          "fields":
          {
            issuetype,
            summary,
            description,
            issuepriority,
            created
            issuesGeminiIdIds: string[]
          }
        }
      },
      "sprints":
        {
          "sprint":
          {
            name,
            startDate,
            endDate,
            goal,
            issuesGeminiIdIds: string[]
          }
        }
      }

      Stwórz cały potrzebny zestaw danych.
      Nie dodawaj redundantnych komentarzy.
      Zwróć tylko dane w formacie JSON.
    `;

    const resultPromise = model.generateContent(promptWithContext);
    return from(resultPromise).pipe(
      map(response => response.response?.text() || null)
    );
  }
}
