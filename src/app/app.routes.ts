import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'snippets',
    loadChildren: () => import('./features/snippets/snippets.routes').then(m => m.SNIPPETS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'shared',
    loadComponent: () => import('./features/snippets/shared-snippets/shared-snippets.component').then(m => m.SharedSnippetsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'public',
    loadComponent: () => import('./features/snippets/public-snippets/public-snippets.component').then(m => m.PublicSnippetsComponent)
  }
];
