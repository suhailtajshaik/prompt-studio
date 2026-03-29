import { useState, useCallback, useRef } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'csv', 'json', 'js', 'py', 'ts', 'jsx', 'tsx',
  'html', 'css', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'log',
  'sh', 'bash', 'zsh', 'sql', 'env', 'gitignore', 'dockerfile',
  'makefile', 'rs', 'go', 'java', 'kt', 'swift', 'rb', 'php', 'c',
  'cpp', 'h', 'hpp', 'r', 'scala', 'dart', 'lua', 'pl', 'ex', 'exs',
]);

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'tif']);

/**
 * Hook for handling file uploads and extracting text content.
 * Supports text files, PDFs (via pdf.js), and images with text (via Tesseract OCR).
 * PDF and OCR libraries are lazy-loaded on first use.
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

  const extractPdfText = useCallback(async (file) => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      if (pageText.trim()) {
        pages.push(pageText.trim());
      }
    }

    const text = pages.join('\n\n');
    if (!text.trim()) {
      throw new Error('Could not extract text from this PDF. The file may contain only images or scanned content.');
    }
    return text;
  }, []);

  const extractImageText = useCallback(async (file) => {
    const Tesseract = await import('tesseract.js');
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    const cleaned = text.trim();
    if (!cleaned) {
      throw new Error('Could not extract text from this image. The image may not contain readable text.');
    }
    return cleaned;
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
      if (TEXT_EXTENSIONS.has(ext) || mimeType.startsWith('text/')) {
        const text = await readTextFile(file);
        setFileName(file.name);
        onTextExtracted(text, file.name);
        return;
      }

      // PDF
      if (ext === 'pdf' || mimeType === 'application/pdf') {
        const text = await extractPdfText(file);
        setFileName(file.name);
        onTextExtracted(text, file.name);
        return;
      }

      // Images - OCR
      if (IMAGE_EXTENSIONS.has(ext) || mimeType.startsWith('image/')) {
        const text = await extractImageText(file);
        setFileName(file.name);
        onTextExtracted(text, file.name);
        return;
      }

      // DOCX - basic extraction
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8);
        const textContent = rawText.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        if (textContent.length > 50) {
          setFileName(file.name);
          onTextExtracted(textContent, file.name);
        } else {
          throw new Error('Could not extract text from this DOCX. Try copying the text manually.');
        }
        return;
      }

      throw new Error(`Unsupported file type: .${ext}. Try TXT, MD, CSV, JSON, PDF, DOCX, or image files.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [onTextExtracted, readTextFile, extractPdfText, extractImageText]);

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
