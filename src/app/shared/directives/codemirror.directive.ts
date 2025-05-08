import { Directive, ElementRef, EventEmitter, Input, Output, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { defaultKeymap } from '@codemirror/commands';

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#c678dd" },
  { tag: tags.comment, color: "#98c379", fontStyle: "italic" },
  { tag: tags.string, color: "#98c379" },
  { tag: tags.function(tags.variableName), color: "#61afef" },
  { tag: tags.number, color: "#d19a66" },
  { tag: tags.propertyName, color: "#e06c75" },
  { tag: tags.variableName, color: "#abb2bf" },
  { tag: tags.operator, color: "#56b6c2" },
]);

@Directive({
  selector: '[appCodeMirror]',
  standalone: true
})
export class CodeMirrorDirective implements OnInit, OnDestroy, OnChanges {
  @Input('appCodeMirror') code = '';
  @Input() language = 'javascript';
  @Output() codeChange = new EventEmitter<string>();
  
  private view: EditorView | null = null;

  constructor(private element: ElementRef) {}

  private getLanguageSupport(language: string) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return javascript();
      case 'html':
        return html();
      case 'css':
      case 'scss':
        return css();
      default:
        return javascript();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['code'] && this.view && !changes['code'].firstChange) {
      const currentValue = this.view.state.doc.toString();
      if (currentValue !== changes['code'].currentValue) {
        this.updateEditorContent(changes['code'].currentValue);
      }
    }
  }

  private updateEditorContent(newContent: string) {
    if (this.view) {
      this.view.dispatch({
        changes: {
          from: 0,
          to: this.view.state.doc.length,
          insert: newContent
        }
      });
    }
  }

  ngOnInit() {
    const startState = EditorState.create({
      doc: this.code,
      extensions: [
        this.getLanguageSupport(this.language),
        syntaxHighlighting(myHighlightStyle),
        keymap.of(defaultKeymap),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            this.codeChange.emit(update.state.doc.toString());
          }
        }),
        EditorView.editable.of(true),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            backgroundColor: '#0f172a'
          },
          '.cm-scroller': {
            overflow: 'auto',
            height: '100%'
          },
          '.cm-content': {
            fontFamily: 'monospace',
            padding: '10px',
            color: '#d4d4d4',
            minHeight: '100%',
            caretColor: '#d4d4d4'
          },
          '.cm-line': {
            padding: '0 3px',
            lineHeight: '1.6',
            fontFamily: 'monospace'
          },
          '.cm-matchingBracket': {
            backgroundColor: '#1e293b',
            color: '#8b5cf6'
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(139, 92, 246, 0.1)'
          },
          '.cm-gutters': {
            backgroundColor: '#0f172a',
            color: '#858585',
            border: 'none'
          },
          '.cm-lineNumbers': {
            color: '#858585'
          },
          '&.cm-focused': {
            outline: 'none'
          }
        }, { dark: true })
      ]
    });

    this.view = new EditorView({
      state: startState,
      parent: this.element.nativeElement
    });
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
  }
}