import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/auth.interfaces';
import { ServerResponse } from '../interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<ServerResponse<User[]>> {
    return this.http.get<ServerResponse<User[]>>(this.apiUrl);
  }
} 