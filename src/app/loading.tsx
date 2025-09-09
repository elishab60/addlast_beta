// app/loading.tsx
"use client";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-200/70 backdrop-blur-md">
      <span className="text-lg font-semibold text-gray-700 animate-pulse">
        Chargement…
      </span>
        </div>
    );
}
