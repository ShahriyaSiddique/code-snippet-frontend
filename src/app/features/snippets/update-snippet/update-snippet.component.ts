import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, ActivatedRoute } from '@angular/router';
import { CodeMirrorDirective } from '../../../shared/directives/codemirror.directive';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { SnippetService } from '../../../core/services/snippet.service';
import { signal } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-update-snippet',
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
  templateUrl: './update-snippet.component.html',
  styleUrls: ['./update-snippet.component.scss']
})
export class UpdateSnippetComponent implements OnInit {
  @ViewChild(CodeMirrorDirective) codeMirror!: CodeMirrorDirective;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snippetService = inject(SnippetService);
  
  isLoading = signal(false);
  error = signal<string | null>(null);
  snippetForm = this.fb.group({
    title: ['', [Validators.required]],
    language: ['javascript'],
    code: ['', [Validators.required]],
    isPublic: [false]
  });

  languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' }
  ];

  ngOnInit(): void {
    const snippetId = this.route.snapshot.paramMap.get('id');
    if (snippetId) {
      this.snippetService.getSnippetById(snippetId)
      .pipe(map(res => res?.data))
      .subscribe({
        next: (snippet: Snippet) => {
          this.snippetForm.patchValue(snippet);
        },
        error: (err) => {
          this.error.set('Failed to load snippet');
        }
      });
    }
  }

  async onSubmit() {
    if (this.snippetForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      
      const updatedSnippet: Snippet = this.snippetForm.value as Snippet;
      const snippetId = this.route.snapshot.paramMap.get('id');

      if (snippetId) {
        this.snippetService.updateSnippet(snippetId, updatedSnippet).subscribe({
          next: () => {
            console.log('Snippet updated successfully');
            this.router.navigate(['/snippets']);
          },
          error: (err) => {
            this.error.set('Failed to update snippet');
          }
        });
      }
    }
  }
} 