"use client";

import { useFileUpload } from "@/hooks/useFileUpload";
import { SUPPORTED_FILE_EXTENSIONS, MAX_FILE_SIZE_MB } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface PolicyUploaderProps {
  onFileReady?: (file: File) => void;
  isAnalysing?: boolean;
}

export default function PolicyUploader({ onFileReady, isAnalysing = false }: PolicyUploaderProps) {
  const {
    file,
    fileName,
    isDragging,
    error,
    isValid,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearFile,
    inputRef,
    openFilePicker,
  } = useFileUpload();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!file ? openFilePicker : undefined}
        className={`
          relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-all duration-300 cursor-pointer
          ${isDragging
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-[1.02]"
            : file
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
          }
        `}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_FILE_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="hidden"
          id="policy-file-input"
        />

        {!file ? (
          <>
            {/* Upload icon */}
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${isDragging ? "bg-[var(--color-primary)]/20" : "bg-white/5"}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "var(--color-primary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-center space-y-2">
              <p className="text-[var(--color-foreground)] font-medium">
                {isDragging ? "Drop your policy here" : "Drag & drop your policy document"}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                or <span className="text-[var(--color-primary)] font-medium hover:underline">browse files</span>
              </p>
            </div>

            <p className="text-xs text-[var(--color-muted)]">
              Supports {SUPPORTED_FILE_EXTENSIONS.join(", ")} • Max {MAX_FILE_SIZE_MB}MB
            </p>
          </>
        ) : (
          <>
            {/* File selected state */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[var(--color-foreground)] font-medium truncate max-w-xs">
                {fileName}
              </p>
              <p className="text-xs text-emerald-400">Ready for analysis</p>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                Remove
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isAnalysing}
                onClick={(e) => {
                  e.stopPropagation();
                  if (file && onFileReady) onFileReady(file);
                }}
              >
                {isAnalysing ? "Analysing..." : "Analyse Policy"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
