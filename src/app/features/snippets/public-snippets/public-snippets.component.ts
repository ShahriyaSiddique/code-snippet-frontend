import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { SnippetService } from '../../../core/services/snippet.service';
import { signal } from '@angular/core';
import { SnippetCardComponent } from '../snippet-card/snippet-card.component';
import { ViewSnippetDialogComponent } from '../view-snippet-dialog/view-snippet-dialog.component';

@Component({
  selector: 'app-public-snippets',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SnippetCardComponent
  ],
  templateUrl: './public-snippets.component.html',
  styleUrls: ['./public-snippets.component.scss']
})
export class PublicSnippetsComponent implements OnInit {
  private snippetService = inject(SnippetService);
  private dialog = inject(MatDialog);

  snippets = signal<Snippet[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSnippets();
  }

  private loadSnippets(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.snippetService.getPublicSnippets()
      .pipe(map(res => res?.data))
      .subscribe({
        next: (snippets) => {
          this.snippets.set(snippets ?? []);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load public snippets');
          this.isLoading.set(false);
        }
      });
  }

  onView(snippet: Snippet): void {
    this.dialog.open(ViewSnippetDialogComponent, {
      data: snippet,
      panelClass: 'app-view-snippet-dialog',
      maxWidth: '90vw'
    });
  }
}
