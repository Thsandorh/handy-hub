'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  type: 'avatar' | 'task-photo' | 'id-document' | 'selfie';
  onUploadComplete?: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  type,
  onUploadComplete,
  accept = 'image/*',
  maxSizeMB = 5,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`A fájl mérete nem haladhatja meg a ${maxSizeMB}MB-ot`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Csak kép fájlokat lehet feltölteni');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${apiUrl}/files/upload/${type}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Feltöltés sikertelen');
      }

      const data = await response.json();

      if (onUploadComplete) {
        onUploadComplete(data.url);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt a feltöltés során');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-sm rounded-lg border"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <p className="text-white font-semibold">Feltöltés...</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${type}`}
          disabled={uploading}
        />
        <label htmlFor={`file-upload-${type}`}>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
            className="cursor-pointer"
            asChild
          >
            <span>
              {uploading
                ? 'Feltöltés...'
                : preview
                ? 'Másik kép választása'
                : '📁 Fájl kiválasztása'}
            </span>
          </Button>
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Max. {maxSizeMB}MB, {accept}
        </p>
      </div>
    </div>
  );
}
