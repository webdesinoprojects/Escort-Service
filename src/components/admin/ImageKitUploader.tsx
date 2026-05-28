"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageKitUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageKitUploader({ value, onChange, folder = "oklute" }: ImageKitUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size allowed is 5MB.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading image to ImageKit...");

    try {
      // 1. Get authentication parameters from API
      const authRes = await fetch("/api/imagekit/auth");
      if (!authRes.ok) throw new Error("Failed to authenticate ImageKit upload");
      
      const authData = await authRes.json();
      const { signature, token, expire } = authData;

      // 2. Prepare Form Data for direct upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
      formData.append("signature", signature);
      formData.append("token", token);
      formData.append("expire", expire);
      formData.append("folder", folder);

      // 3. Post directly to ImageKit Upload API
      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const uploadData = await uploadRes.json();
      
      // 4. Return URL
      onChange(uploadData.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error("ImageKit upload error:", err);
      toast.error(err.message || "Failed to upload image.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-4 select-none">
      {value ? (
        <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-border group bg-muted flex items-center justify-center">
          {value.startsWith("/") ? (
            // Local fallback images
            <Image
              src={value}
              alt="Uploaded image preview"
              fill
              sizes="384px"
              className="object-cover"
            />
          ) : (
            // Remote ImageKit URL
            <Image
              src={value}
              alt="Uploaded image preview"
              fill
              sizes="384px"
              className="object-cover"
              unoptimized // Disable next/image optimization for external ImageKit URLs during dev
            />
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`aspect-video w-full max-w-sm border-2 border-dashed border-border/80 hover:border-[#cf4f41] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-muted/40 bg-card p-4 text-center
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#cf4f41] animate-spin mb-2" />
              <span className="text-sm font-semibold text-foreground">Uploading file...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-muted rounded-full border border-border mb-2.5">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">Upload Image</span>
              <span className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG up to 5MB</span>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
