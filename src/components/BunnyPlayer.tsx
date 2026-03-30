"use client";

import React from "react";

interface BunnyPlayerProps {
  src: string;
  className?: string;
}

const BunnyPlayer: React.FC<BunnyPlayerProps> = ({ 
  src, 
  className = "aspect-video w-full"
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-black ${className}`}>
      <iframe
        src={src}
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default BunnyPlayer;
