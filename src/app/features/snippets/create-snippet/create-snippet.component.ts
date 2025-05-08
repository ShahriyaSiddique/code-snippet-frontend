import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CodeMirrorDirective } from '../../../shared/directives/codemirror.directive';

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
    CodeMirrorDirective
  ],
  templateUrl: './create-snippet.component.html',
  styleUrls: ['./create-snippet.component.scss']
})
export class CreateSnippetComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
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
    description: [''],
    language: ['javascript'],
    code: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.snippetForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      
      // TODO: Implement snippet creation logic
      console.log('Form submitted:', this.snippetForm.value);
      
      this.isLoading.set(false);
      await this.router.navigate(['/snippets']);
    }
  }
}