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
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

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
  @Input() actions = true;
  /** When true, clicking the card opens view (for public/list view-only) */
  @Input() viewOnClick = false;
  @Output() edit = new EventEmitter<Snippet>();
  @Output() delete = new EventEmitter<Snippet>();
  @Output() view = new EventEmitter<Snippet>();

  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  selectedUserId = signal<string>('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  currentUser = this.authService.user();

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

  onDeleteClick(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete snippet',
        message: 'Delete this snippet? This cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmWarn: true
      },
      panelClass: 'app-confirm-dialog'
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.delete.emit(this.snippet);
      }
    });
  }
} 