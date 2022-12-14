declare module 'react-dropbox-chooser' {
  export default any
}

declare namespace Dropbox {
  interface File {
    // Unique ID for the file, compatible with Dropbox API v2.
    id: string;

    // Name of the file.
    name: string;

    // URL to access the file, which varies depending on the linkType specified when the
    // Chooser was triggered.
    link: string,

    // Size of the file in bytes.
    bytes: number,

    // URL to a 64x64px icon for the file based on the file's extension.
    icon: string,

    // A thumbnail URL generated when the user selects images and videos.
    // If the user didn't select an image or video, no thumbnail will be included.
    thumbnailLink: string,

    // Boolean, whether or not the file is actually a directory
    isDir: boolean,
  }
}
