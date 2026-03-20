"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, Video, Loader2, X, AlertCircle } from "lucide-react";

interface BunnyVideoUploadProps {
  onSuccess: (videoId: string) => void;
  currentVideoId?: string;
  label?: string;
}

export default function BunnyVideoUpload({ onSuccess, currentVideoId, label }: BunnyVideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState(currentVideoId || "");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      // 1. Get Signed Authorization & Video ID
      const authRes = await fetch("/api/admin/bunny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.name }),
      });

      if (!authRes.ok) throw new Error("فشل الحصول على تصريح الرفع");
      const { videoId: newVideoId, libraryId, apiKey } = await authRes.json();

      // Early callback so parent can save the videoId immediately
      setVideoId(newVideoId);
      onSuccess(newVideoId);

      // 2. Upload Direct to Bunny
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `https://video.bunnycdn.com/library/${libraryId}/videos/${newVideoId}`);
      
      // Use AccessKey directly for the PUT request as Bunny requires it for this endpoint
      xhr.setRequestHeader("AccessKey", apiKey);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setVideoId(newVideoId);
          onSuccess(newVideoId);
          setUploading(false);
          setProgress(100);
        } else {
          setError("فشل رفع الملف إلى Bunny.net");
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("حدث خطأ في الشبكة أثناء الرفع");
        setUploading(false);
      };

      xhr.send(file);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-sm font-bold block">{label}</label>}
      
      <div className="relative">
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleUpload} 
          ref={fileInputRef} 
          className="hidden" 
        />
        
        <div className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 ${uploading ? 'bg-primary/5 border-primary/20' : videoId ? 'bg-green-500/5 border-green-500/20' : 'bg-surface/30 border-surface hover:border-primary/50 cursor-pointer'}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin text-primary" size={32} />
              <div className="w-full max-w-xs bg-surface/50 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs font-black">جاري الرفع... {progress}%</p>
            </>
          ) : videoId ? (
            <>
              <div className="flex items-center gap-3 text-green-600 font-black italic">
                <CheckCircle size={24} /> تم الرفع بنجاح
              </div>
              <p className="text-[10px] font-mono text-foreground-muted">Video ID: {videoId}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setVideoId(""); }}
                className="text-[10px] text-red-500 underline flex items-center gap-1 mt-2"
              >
                 <X size={10} /> حذف وتغيير الملف
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Video size={24} />
              </div>
              <p className="text-sm font-bold">اختر ملف الفيديو أو اسحبه هنا</p>
              <p className="text-[10px] text-foreground-muted italic">أقصى حجم للملف يعتمد على باقة Bunny.net الخاصة بك</p>
            </>
          )}

          {error && (
            <div className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
