export type DropboxFile = {
  id: string;
  name: string;
  link: string;
  bytes: number;
  icon: string;
  thumbnailLink?: string;
  isDir: boolean;
}

export type DropboxChooser = {
  choose(options: DropboxChooserOptions): void;
}

export type DropboxChooserOptions = {
  success(files: DropboxFile[]): void;
  cancel?: () => void;
  linkType?: 'preview' | 'direct';
  multiselect?: boolean;
  extensions?: string[];
  folderselect?: boolean;
  sizeLimit?: number;
}


