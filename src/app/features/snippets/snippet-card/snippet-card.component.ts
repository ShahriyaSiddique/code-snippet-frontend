import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';

@Component({
  selector: 'app-snippet-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './snippet-card.component.html',
  styleUrls: ['./snippet-card.component.scss']
})
export class SnippetCardComponent {
  @Input() snippet!: Snippet;
  @Output() edit = new EventEmitter<Snippet>();
} 