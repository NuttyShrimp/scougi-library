'use client';
import { useEffect, useMemo, useState } from "react";
import AutoComplete from "./AutoComplete"
import { TrimOptions, TrimesterNames } from "@/enums/trimesterNames";
import { FileUp, Send } from 'lucide-react';
import DropboxChooser from "./DropboxChooser";
import { PDFDocument } from "pdf-lib";
import { downloadFromDropbox, splitDocToPages, uploadPage } from "@/lib/pdf";
import { revalidatePath } from "next/cache";

export const ScougiUploader = (props: { years: Record<string, number[]> }) => {
  const [yearValue, setYearValue] = useState("")
  const [trimValue, setTrimValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<Dropbox.file | null>(null);
  const [processing, setProcessing] = useState(false);

  const trimOptions = useMemo(() =>
    TrimOptions.filter((_, i) => props.years?.[yearValue ?? '2022-2023']?.includes(i) ?? true)
  , [yearValue, props.years]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);

    // TODO :add proper toast notifications with sonner
    if (!selectedFile) {
      return;
    }
    if (trimValue === "") {
      return
    }

    try {
      let doc: PDFDocument;
      try {
        doc = await downloadFromDropbox(selectedFile.link)
      } catch (e) {
        console.error(e)
        return;
      }
      const pages = await splitDocToPages(doc);

      const res = await fetch(`/scougi/${yearValue}/${trimValue}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pages: pages.length,
        }),
      });
      if (!res.ok) {
        // TODO: Show with toast
        const resp = await res.json();
        console.error(resp.message);
        return;
      }

      const failedPages: number[] = [];
      for (let i = 0; i < pages.length; i++) {
        const ok = await uploadPage(yearValue, Number(trimValue), i, pages[i]);
        if (!ok) {
          failedPages.push(i);
        }
      }
      console.log(failedPages);
      revalidatePath('/admin')
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <AutoComplete name="year" label="Jaar" items={Object.keys(props.years)} value={yearValue} onChange={setYearValue} />
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Trimester</span>
        </div>
        <select value={trimValue} onChange={e => setTrimValue(e.currentTarget.value)} className="select select-bordered">
          <option value="" disabled>Pick one</option>
          {trimOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <div>
        {selectedFile && <div className="label"><span className="label-text">{selectedFile.name}</span></div>}
        <DropboxChooser
          appKey={"24ejhxqih5zow8j"}
          onSuccess={(files: Dropbox.file[]) => setSelectedFile(files[0])}
        >
          <div className="btn btn-primary">
            <FileUp />
            <span className="ml-2">Select scougi</span>
          </div>
        </DropboxChooser>
      </div>
      <button disabled={processing} type="submit" className={`btn btn-success ${processing ? "btn-disabled" : ""}`}>
        <Send />
        <span>Upload</span>
      </button>
    </form >
  )
}
