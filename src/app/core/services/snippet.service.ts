import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Snippet, CreateSnippetDTO } from '../interfaces/snippet.interfaces';
import { ServerResponse } from '../interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/snippets`;

  createSnippet(snippet: CreateSnippetDTO): Observable<ServerResponse<Snippet>> {
    return this.http.post<ServerResponse<Snippet>>(this.apiUrl, snippet);
  }

  getSnippets(): Observable<ServerResponse<Snippet[]>> {
    return this.http.get<ServerResponse<Snippet[]>>(this.apiUrl);
  }

  getSnippetById(id: String): Observable<ServerResponse<Snippet>> {
    return this.http.get<ServerResponse<Snippet>>(`${this.apiUrl}/${id}`);
  }

  updateSnippet(id: string, snippet: Partial<Snippet>): Observable<ServerResponse<Snippet>> {
    return this.http.patch<ServerResponse<Snippet>>(`${this.apiUrl}/${id}`, snippet);
  }

  deleteSnippet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}