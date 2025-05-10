import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { defaultKeymap } from '@codemirror/commands';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { Awareness } from 'y-protocols/awareness';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

interface AwarenessState {
  user?: {
    name: string;
    color: string;
  };
}

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
  @Input() roomId = 'default-room';
  @Input() userName = 'Anonymous';
  @Input() userColor = '#8b5cf6';
  @Output() codeChange = new EventEmitter<string>();
  @Output() usersChange = new EventEmitter<Array<{ name: string; color: string }>>();
  
  private view: EditorView | null = null;
  private ydoc: Y.Doc | null = null;
  private ytext: Y.Text | null = null;
  private provider: WebsocketProvider | null = null;
  private awareness: Awareness | null = null;

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
      const currentContent = this.view.state.doc.toString();
      if (currentContent !== newContent) {
        const cursorPos = this.view.state.selection.main.head;
        this.view.dispatch({
          changes: {
            from: 0,
            to: this.view.state.doc.length,
            insert: newContent
          },
          selection: { anchor: cursorPos, head: cursorPos }
        });
      }
    }
  }

  private setupCollaboration() {
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText('codemirror');
    
    this.provider = new WebsocketProvider(
      'ws://localhost:1234',
      this.roomId,
      this.ydoc,
      { connect: true }
    );

    this.awareness = this.provider.awareness;
    this.awareness.setLocalStateField('user', {
      name: this.userName,
      color: this.userColor
    });

    this.awareness.on('change', () => {
      const states = Array.from(this.awareness!.getStates().entries())
        .map(([clientId, state]) => ({
          name: (state as AwarenessState)['user']?.name || 'Anonymous',
          color: (state as AwarenessState)['user']?.color || '#8b5cf6'
        }));
      this.usersChange.emit(states);
    });

    if (this.code) {
      this.ytext.insert(0, this.code);
    }
  }

  ngOnInit() {
    this.setupCollaboration();

    const startState = EditorState.create({
      doc: this.code,
      extensions: [
        this.getLanguageSupport(this.language),
        syntaxHighlighting(myHighlightStyle),
        keymap.of(defaultKeymap),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            this.codeChange.emit(newContent);
            
            if (this.ytext) {
              const currentContent = this.ytext.toString();
              if (currentContent !== newContent) {
                this.ydoc?.transact(() => {
                  this.ytext?.delete(0, currentContent.length);
                  this.ytext?.insert(0, newContent);
                });
              }
            }
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

    this.ytext?.observe(event => {
      if (this.view) {
        const currentContent = this.view.state.doc.toString();
        const newContent = this.ytext!.toString();
        if (currentContent !== newContent) {
          const cursorPos = this.view.state.selection.main.head;
          this.view.dispatch({
            changes: {
              from: 0,
              to: this.view.state.doc.length,
              insert: newContent
            },
            selection: { anchor: cursorPos, head: cursorPos }
          });
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
    if (this.provider) {
      this.provider.destroy();
    }
    if (this.ydoc) {
      this.ydoc.destroy();
    }
  }
}