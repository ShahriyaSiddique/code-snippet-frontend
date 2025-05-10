import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { SnippetService } from '../../../core/services/snippet.service';
import { CodeMirrorDirective } from '../../../shared/directives/codemirror.directive';

interface Collaborator {
  name: string;
  color: string;
}

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
  private authService = inject(AuthService);
  
  isLoading = signal(false);
  error = signal<string | null>(null);
  collaborators = signal<Collaborator[]>([]);
  currentUser = signal<{ name: string; color: string }>({
    name: this.authService.user()?.name || 'Anonymous',
    color: this.getRandomColor()
  });

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

  private getRandomColor(): string {
    const colors = ['#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  ngOnInit(): void {
    const snippetId = this.route.snapshot.paramMap.get('id');
    if (snippetId) {
      this.snippetService.getSnippetById(snippetId)
      .pipe(map(res => res?.data))
      .subscribe({
        next: (snippet: Snippet) => {
          this.snippetForm.patchValue(snippet);
          this.codeMirror.roomId = `snippet-${snippetId}`;
          this.codeMirror.userName = this.currentUser().name;
          this.codeMirror.userColor = this.currentUser().color;
        },
        error: (err) => {
          this.error.set('Failed to load snippet');
        }
      });
    }
  }

  onUsersChange(users: Collaborator[]) {
    this.collaborators.set(users);
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