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

    const messageWithContext =
      `
      ${message}.
      Użytkownik chce założyć projekt w JIRA poprzez REST API.
      Będzie potrzebował zestawu danych, żeby przesłać je do API.

      Stwórz JSON z projektem. Wypełnij potrzebne pola.

      Jeżeli Użytkownik nie podał nazwy to stwórz kreatywną nazwę projektu.

      Stwórz od jednej do kilku epic. Nadaj im nazwy adekwatne do projektu.

      Stwórz odpowiednią a by zrealizować cały projekt ilość zadań (issues).
      Dodaj do epic adekwatne issues.
      Issue mogą mieć typ: Story - 10006, Task - 10007, Epic - 10000. Ustawiaj wartość liczbową.
      Task to zadanie techniczne jak konfiguracja, założenie bazy danych itp.
      Nie powinno być więcej niż 20% tasków w sprincie.

      Issue powinny mieć różne priority.
      Na podstawie nazwy i innych informacji o issue, zdecyj jakie powienien mieć priority.
      Możliwe typy priority: 1 - Highest, 2 - High, 3 - Medium, 4 - Low, 5 - Lowest.
      Ustawiaj wartość liczbową.

      Epics i issues powinny mieć adekwatny, w miarę rozbudowany opis(decription),
      opisujący co należy zrobić.

      Jeżeli użytkownik nie podał daty startu projektu, to projekt startuje dzisiaj.
      Sprint trwa 2 tygodnie.
      Załóż kilka sprintów. Oszacuj ile sprintów potrzeba na zrealizowanie projektu.
      Dodaj do tych sprintów id stworzonych issues (bez epiców)

      Proszę o zwrócenie informacji formacie JSON.
      Informacje powinny zawierać następujące klucze:

      "project":
      {
        key,
        name (max 30 znaków),
        description
      },
      "issues":
        {
          {
            geminiId,
            "fields":
            {
              issuetype,
              summary(max 30 znaków),
              description,
              priority
            }
          },
          {
            geminiId,
            "fields":
            {
              issuetype,
              summary(max 30 znaków),
              description,
              priority
            }
          }
        },
      "epics":
      {
        {
          geminiId,
          issuesGeminiIds: string[],
          "fields":
          {
            issuetype,
            summary(max 30 znaków),
            description,
            priority
          }
        },
        {
          geminiId,
          issuesGeminiIds: string[],
          "fields":
          {
            issuetype,
            summary(max 30 znaków),
            description,
            priority
          }
        }
      },
      "sprints":
        {
          {
            name(max 30 znaków),
            startDate,
            endDate,
            goal(max 30 znaków),
            issuesGeminiIds: string[]
          },
          {
            name(max 30 znaków),
            startDate,
            endDate,
            goal(max 30 znaków),
            issuesGeminiIds: string[]
          }
        }
      }

      Stwórz cały potrzebny zestaw danych.
      Nie dodawaj redundantnych komentarzy.
      Zwróć tylko dane w formacie JSON.
    `;

    const resultPromise = model.generateContent(messageWithContext);
    return from(resultPromise).pipe(
      map(response => response.response?.text() || null)
    );
  }
}
