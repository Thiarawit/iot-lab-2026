export interface Author {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  publishedYear: number | null;
  author: Author;
}
