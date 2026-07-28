'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, X, Loader2, User } from 'lucide-react';

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export default function PhotoUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Upload a file (or blob) to Cloudinary
  async function uploadToCloudinary(file: File | Blob) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        alert('Upload failed. Check Cloudinary settings.');
      }
    } catch {
      alert('Upload error — could not reach Cloudinary.');
    } finally {
      setUploading(false);
    }
  }

  // File upload handler
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  }

  // Start webcam
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowCamera(true);
      // Wait for the video element to mount
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      alert('Could not access camera. Please allow camera permission or use file upload.');
    }
  }

  // Stop webcam
  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  }

  // Capture photo from webcam
  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) uploadToCloudinary(blob);
    }, 'image/jpeg', 0.9);

    stopCamera();
  }

  return (
    <div>
      {/* Camera view */}
      {showCamera ? (
        <div className="relative rounded-2xl overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="rounded-full bg-white text-[#1E3A6E] px-5 py-2.5 text-sm font-medium shadow-lg hover:bg-slate-100"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-full bg-red-500 text-white px-5 py-2.5 text-sm font-medium shadow-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : value ? (
        /* Photo preview */
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden ring-1 ring-slate-200">
          <Image src={value} alt="Patient photo" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Empty state + buttons */
        <div className="flex items-center gap-4">
          <div className="w-40 h-40 rounded-2xl bg-slate-50 ring-1 ring-slate-200 flex flex-col items-center justify-center text-slate-300">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#2E5FA3]" />
            ) : (
              <>
                <User className="h-10 w-10" />
                <span className="text-xs mt-1">No photo</span>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={startCamera}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              Use Camera
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}