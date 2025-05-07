import { Injectable, computed, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../interfaces/auth.interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly AUTH_TOKEN_KEY = 'access_token';
  private readonly userSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly isBrowser: boolean;
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeAuth();
  }

  private initializeAuth() {
    console.log('[AuthService] initializeAuth called');
    this.isLoadingSignal.set(true);
    if (this.isBrowser) {
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
      console.log('[AuthService] Token in localStorage:', token);
      if (token) {
        this.tokenSignal.set(token);
        this.loadUserProfile().pipe(
          finalize(() => {
            this.isLoadingSignal.set(false);
            console.log('[AuthService] Loading finished');
          }),
          tap(() => {}),
          catchError((err) => {
            console.log('[AuthService] Profile request error:', err);
            if (err.status === 401 || err.status === 403) {
              this.logout();
            }
            return of(null);
          })
        ).subscribe();
      } else {
        this.isLoadingSignal.set(false);
        console.log('[AuthService] No token, loading finished');
      }
    } else {
      this.isLoadingSignal.set(false);
      console.log('[AuthService] Not browser, loading finished');
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    console.log('[AuthService] Logging out');
    if (this.isBrowser) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private loadUserProfile(): Observable<User> {
    console.log('[AuthService] Loading user profile...');
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(
      tap(user => {
        console.log('[AuthService] User profile loaded:', user);
        this.userSignal.set(user);
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, response.accessToken);
    }
    this.tokenSignal.set(response.accessToken);
    this.userSignal.set(response.user);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}