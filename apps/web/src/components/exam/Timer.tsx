"use client";

export function Timer({ remainingSeconds }: { remainingSeconds: number }) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="rounded border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700">
      {minutes}:{seconds}
    </div>
  );
}
