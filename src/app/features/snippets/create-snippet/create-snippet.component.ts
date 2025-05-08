import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { CodeMirrorDirective } from '../../../shared/directives/codemirror.directive';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { SnippetService } from '../../../core/services/snippet.service';

@Component({
  selector: 'app-create-snippet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    CodeMirrorDirective
  ],
  templateUrl: './create-snippet.component.html',
  styleUrls: ['./create-snippet.component.scss']
})
export class CreateSnippetComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snippetService = inject(SnippetService);
  
  isLoading = signal(false);
  error = signal<string | null>(null);

  languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' }
  ];

  snippetForm = this.fb.group({
    title: ['', [Validators.required]],
    language: ['javascript'],
    code: ['', [Validators.required]],
    isPublic: [false]
  });

  async onSubmit() {
    if (this.snippetForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      
      const snippet: Snippet = this.snippetForm.value as Snippet;
      
      this.snippetService.createSnippet(snippet).subscribe({
        next: () => {
          console.log('Snippet created successfully');
          this.router.navigate(['/snippets']);
        },
        error: (err) => {
          this.error.set('Failed to create snippet'); // Handle error
        }
      });
    }
  }
}