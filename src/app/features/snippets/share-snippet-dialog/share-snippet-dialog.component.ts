import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/interfaces/auth.interfaces';
import { UserService } from '../../../core/services/user.service';
import { SnippetService } from '../../../core/services/snippet.service';
import { AuthService } from '../../../core/services/auth.service';
import { signal } from '@angular/core';
import { map } from 'rxjs';

interface DialogData {
    snippetId: number;
}

@Component({
    selector: 'app-share-snippet-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatIconModule,
        FormsModule
    ],
    templateUrl: './share-snippet-dialog.component.html',
    styleUrls: ['./share-snippet-dialog.component.scss']
})
export class ShareSnippetDialogComponent {
    private userService = inject(UserService);
    private snippetService = inject(SnippetService);
    private authService = inject(AuthService);
    dialogRef = inject(MatDialogRef);
    private data = inject<DialogData>(MAT_DIALOG_DATA);

    users = signal<User[]>([]);
    selectedUserId = signal<string>('');
    isLoading = signal(false);
    error = signal<string | null>(null);

    constructor() {
        this.loadUsers();
    }

    private loadUsers(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.userService.getUsers()
            .pipe(
                map(res => res?.data),
                map(users => {
                    const currentUser = this.authService.user();
                    return users?.filter(user => user.id !== currentUser?.id) || [];
                })
            )
            .subscribe({
                next: (users) => {
                    this.users.set(users);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.error.set('Failed to load users');
                    this.isLoading.set(false);
                }
            });
    }

    onShare(): void {
        if (this.selectedUserId() && this.data.snippetId) {
            this.isLoading.set(true);
            this.error.set(null);

            this.snippetService.shareSnippet(this.data.snippetId.toString(), [this.selectedUserId()])
                .subscribe({
                    next: () => {
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.error.set('Failed to share snippet');
                        this.isLoading.set(false);
                    }
                });
        }
    }
} 