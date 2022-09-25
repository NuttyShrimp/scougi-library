declare namespace DB {
  interface User {
    id: string;
    name: string;
    email: string;
  }
  interface Scougi {
    id: number;
    year: string;
    trim: number;
    pages: number;
    hidden: boolean;
    updatedAt: string;
    preview: string;
  }
}
