"use client";

import { useState, useCallback, useRef } from "react";
import { validateFile } from "@/services/policy-parser";
import {
  SUPPORTED_FILE_EXTENSIONS,
  MAX_FILE_SIZE_MB,
} from "@/lib/constants";

interface UseFileUploadReturn {
  file: File | null;
  fileName: string;
  isDragging: boolean;
  error: string | null;
  isValid: boolean;
  handleFileSelect: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  clearFile: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  openFilePicker: () => void;
}

/**
 * Hook for managing file upload state, drag & drop, and validation.
 */
export function useFileUpload(): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    const validation = validateFile(selectedFile);

    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      setFile(null);
      setFileName("");
      setIsValid(false);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setIsValid(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setFileName("");
    setError(null);
    setIsValid(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return {
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
  };
}
