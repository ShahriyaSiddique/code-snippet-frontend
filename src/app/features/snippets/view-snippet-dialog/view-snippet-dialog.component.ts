import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { CodeMirrorDirective } from '../../../shared/directives/codemirror.directive';

@Component({
  selector: 'app-view-snippet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CodeMirrorDirective
  ],
  templateUrl: './view-snippet-dialog.component.html',
  styleUrls: ['./view-snippet-dialog.component.scss']
})
export class ViewSnippetDialogComponent {
  dialogRef = inject(MatDialogRef<ViewSnippetDialogComponent>);
  snippet = inject<Snippet>(MAT_DIALOG_DATA);

  onClose(): void {
    this.dialogRef.close();
  }
}
