import { Routes } from '@angular/router';
import { CreateSnippetComponent } from './create-snippet/create-snippet.component';

export const SNIPPETS_ROUTES: Routes = [
  {
    path: 'create',
    component: CreateSnippetComponent
  }
];