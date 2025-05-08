import { Routes } from '@angular/router';
import { CreateSnippetComponent } from './create-snippet/create-snippet.component';
import { UpdateSnippetComponent } from './update-snippet/update-snippet.component';
import { ListSnippetsComponent } from './list-snippets/list-snippets.component';

export const SNIPPETS_ROUTES: Routes = [
  {
    path: '',
    component: ListSnippetsComponent
  },
  {
    path: 'create',
    component: CreateSnippetComponent
  },
  {
    path: ':id/edit',
    component: UpdateSnippetComponent
  }
];