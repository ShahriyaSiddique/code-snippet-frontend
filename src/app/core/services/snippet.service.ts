import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Snippet, CreateSnippetDTO } from '../interfaces/snippet.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/snippets`;

  createSnippet(snippet: CreateSnippetDTO): Observable<Snippet> {
    return this.http.post<Snippet>(this.apiUrl, snippet);
  }

  getSnippets(): Observable<Snippet[]> {
    return this.http.get<Snippet[]>(this.apiUrl);
  }

  getSnippetById(id: number): Observable<Snippet> {
    return this.http.get<Snippet>(`${this.apiUrl}/${id}`);
  }

  updateSnippet(id: number, snippet: Partial<Snippet>): Observable<Snippet> {
    return this.http.patch<Snippet>(`${this.apiUrl}/${id}`, snippet);
  }

  deleteSnippet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}