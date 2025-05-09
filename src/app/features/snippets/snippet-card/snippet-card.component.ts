import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../core/interfaces/auth.interfaces';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { ShareSnippetDialogComponent } from '../share-snippet-dialog/share-snippet-dialog.component';

@Component({
  selector: 'app-snippet-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './snippet-card.component.html',
  styleUrls: ['./snippet-card.component.scss']
})
export class SnippetCardComponent {
  @Input() snippet!: Snippet;
  @Output() edit = new EventEmitter<Snippet>();

  private dialog = inject(MatDialog);

  users = signal<User[]>([]);
  selectedUserId = signal<string>('');
  isLoading = signal(false);
  error = signal<string | null>(null);

  onShareClick(): void {
    const dialogRef = this.dialog.open(ShareSnippetDialogComponent, {
      data: { snippetId: this.snippet.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Snippet shared successfully');
      }
    });
  }
} 