"use client";
import React, { useEffect, useCallback, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Dropbox: any;
  }
}

var options: Dropbox.options =
{
  success: (files: Dropbox.file[]) => {
    console.log('success', files);

  },
  cancel: () => {
    console.log('cancel');

  },
  linkType: "direct", // "preview",
  multiselect: false,
  folderselect: false,
  extensions: ["pdf"]

};

export default function DropboxChooser({ children, onSuccess, onCancel, appKey }: Dropbox.Chooserprops) {
  const [Dropbox, setDropbox] = useState<any>();

  useEffect(() => {
    options.success = (files: Dropbox.file[]) => {
      console.log('success', files);
      onSuccess && onSuccess(files);
    }
    if (onCancel) {
      options.cancel = () => {
        console.log('cancel');
        if (onCancel) {
          onCancel && onCancel();
        }
      }
    }
  }, [onSuccess, onCancel])



  const handleChoose = useCallback(() => {
    if (Dropbox) {
      Dropbox.choose(options);
    }

  }, [Dropbox]);

  return (<>
    <Script
      type="text/javascript"
      src="https://www.dropbox.com/static/api/2/dropins.js"
      id='dropboxjs'
      data-app-key={appKey}
      onLoad={() => {
        console.log("Dropbox loaded");
        setDropbox(window.Dropbox);
      }}
    />
    <div onClick={handleChoose}>
      {children || <button>dropbox chooser</button>}
    </div>
  </>
  );

}
