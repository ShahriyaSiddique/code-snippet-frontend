import { Routes } from '@angular/router';
import { CreateSnippetComponent } from './create-snippet/create-snippet.component';
import { UpdateSnippetComponent } from './update-snippet/update-snippet.component';

export const SNIPPETS_ROUTES: Routes = [
  {
    path: 'create',
    component: CreateSnippetComponent
  },
  {
    path: 'update/:id',
    component: UpdateSnippetComponent
  }
];