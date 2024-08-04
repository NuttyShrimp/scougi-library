import type { DropboxChooser } from '$lib/types';

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('lucia').User | null;
      session: import('lucia').Session | null;
    }
  }

  interface Window {
    Dropbox: DropboxChooser
  }
}

export { };
