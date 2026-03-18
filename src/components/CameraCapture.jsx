import React, { useRef, useState } from 'react';
import { Camera, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CameraCapture({ onCapture, onFileSelect }) {
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleCameraClick = async () => {
    setPermissionDenied(false);

    // On mobile, the native file input with capture="environment" triggers the camera directly
    // We first check if the Permissions API is available to detect denied state
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'camera' });
        if (result.state === 'denied') {
          setPermissionDenied(true);
          return;
        }
      } catch (_) {
        // Permissions API not supported — proceed anyway, the input will handle it
      }
    }

    cameraInputRef.current?.click();
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {/* Camera input — capture="environment" opens the back camera natively on mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        <Button
          onClick={handleCameraClick}
          variant="outline"
          className="flex-1 gap-2"
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </Button>

        {/* File picker input — no capture attribute, opens gallery/file browser */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1 gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload File
        </Button>
      </div>

      {permissionDenied && (
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Camera access is required to analyze your designs. Please enable it in your device <strong>Settings → App Permissions → Camera</strong>.
          </span>
        </div>
      )}
    </div>
  );
}