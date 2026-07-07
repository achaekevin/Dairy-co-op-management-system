import { useRef, useState, type DragEvent } from 'react';
import { HiCloudArrowUp, HiXMark, HiDocument } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export interface FileUploadProps {
  value?: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  showPreview?: boolean;
  className?: string;
}

const FileUpload = ({
  value = [],
  onChange,
  accept,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  multiple = true,
  disabled = false,
  error,
  showPreview = true,
  className,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || disabled) return;

    const filesArray = Array.from(fileList);
    const validFiles: UploadedFile[] = [];

    for (const file of filesArray) {
      if (maxSize && file.size > maxSize) {
        continue;
      }

      if (value.length + validFiles.length >= maxFiles) {
        break;
      }

      const preview = await createFilePreview(file);
      validFiles.push({
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        preview,
      });
    }

    if (validFiles.length > 0) {
      onChange(multiple ? [...value, ...validFiles] : [validFiles[0]]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemove = (fileId: string) => {
    onChange(value.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
          isDragging &&
            'border-primary-500 bg-primary-50 dark:bg-primary-900/10',
          !isDragging &&
            'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500 dark:border-red-400'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <HiCloudArrowUp className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
            {isDragging
              ? 'Drop files here'
              : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {accept || 'Any file type'} up to {formatFileSize(maxSize)}
            {multiple && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* File preview */}
      {showPreview && value.length > 0 && (
        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {value.map((uploadedFile) => (
              <motion.div
                key={uploadedFile.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                    <HiDocument className="w-6 h-6 text-slate-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(uploadedFile.id)}
                  disabled={disabled}
                  className={cn(
                    'p-1 rounded-md transition-colors',
                    'hover:bg-slate-200 dark:hover:bg-slate-700',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-label="Remove file"
                >
                  <HiXMark className="w-5 h-5 text-slate-500" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
