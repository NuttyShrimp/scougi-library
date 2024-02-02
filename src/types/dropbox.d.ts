namespace Dropbox {
  interface file {
    id: string;
    name: string;
    link: string;
    bytes: number;
    icon: string;
    thumbnailLink?: string;
    isDir: boolean;
  }

  interface Chooserprops {
    children?: React.ReactNode
    onSuccess: (files: file[]) => void;
    onCancel?: () => void;
    appKey: string;
  }

  interface options {
    success: (files: file[]) => void; // replace any[] with the actual type of files
    cancel?: () => void;
    multiselect?: boolean;
    linkType?: string;
    folderselect?: boolean;
    extensions?: string[];
    sizeLimit?: number[];
  }

}
