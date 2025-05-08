export interface Snippet {
  id?: number;
  title: string;
  code: string;
  language: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSnippetDTO {
  title: string;
  code: string;
  language: string;
}