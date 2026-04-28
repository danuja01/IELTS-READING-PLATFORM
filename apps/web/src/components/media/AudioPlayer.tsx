"use client";

import { useRef } from "react";

export function AudioPlayer({
  src,
  title,
}: {
  src: string;
  title?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      {title ? <p className="mb-2 text-sm font-medium text-slate-700">{title}</p> : null}
      <audio ref={audioRef} controls preload="metadata" className="w-full">
        <source src={src} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
