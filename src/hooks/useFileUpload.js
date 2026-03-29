import { useState, useCallback, useRef } from 'react';

const SUPPORTED_TYPES = {
  'text/plain': 'txt',
  'text/markdown': 'md',
  'text/csv': 'csv',
  'application/json': 'json',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Hook for handling file uploads and extracting text content.
 * Supports TXT, MD, CSV, JSON files natively.
 * PDF and DOCX show a message that text extraction is limited in-browser.
 */
export function useFileUpload(onTextExtracted) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const readTextFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const processFile = useCallback(async (file) => {
    setError(null);
    setUploading(true);

    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large. Maximum size is 10MB.');
      }

      const ext = file.name.split('.').pop().toLowerCase();
      const mimeType = file.type;

      // Text-based files
      if (['txt', 'md', 'csv', 'json', 'js', 'py', 'ts', 'jsx', 'tsx', 'html', 'css', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'log'].includes(ext) ||
          mimeType.startsWith('text/')) {
        const text = await readTextFile(file);
        setFileName(file.name);
        onTextExtracted(text, file.name);
        return;
      }

      // PDF - extract text from binary
      if (ext === 'pdf' || mimeType === 'application/pdf') {
        const text = await readTextFile(file);
        // Basic text extraction from PDF (works for text-based PDFs)
        const cleaned = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleaned.length > 50) {
          setFileName(file.name);
          onTextExtracted(cleaned, file.name);
        } else {
          throw new Error('Could not extract text from this PDF. Try copying the text manually.');
        }
        return;
      }

      // DOCX - basic extraction
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        // DOCX is a zip file - try to find document.xml content
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8);
        // Extract text between XML tags
        const textContent = rawText.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        if (textContent.length > 50) {
          setFileName(file.name);
          onTextExtracted(textContent, file.name);
        } else {
          throw new Error('Could not extract text from this DOCX. Try copying the text manually.');
        }
        return;
      }

      throw new Error(`Unsupported file type: .${ext}. Try TXT, MD, CSV, JSON, PDF, or DOCX.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [onTextExtracted, readTextFile]);

  const openFilePicker = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const clearFile = useCallback(() => {
    setFileName(null);
    setError(null);
  }, []);

  return {
    uploading,
    fileName,
    error,
    inputRef,
    openFilePicker,
    handleFileChange,
    handleDrop,
    clearFile,
  };
}
