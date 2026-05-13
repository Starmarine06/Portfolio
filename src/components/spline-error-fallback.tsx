"use client";
import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface SplineErrorFallbackProps {
  onRetry: () => void;
  error?: Error;
}

export const SplineErrorFallback: React.FC<SplineErrorFallbackProps> = ({
  onRetry,
  error,
}) => {
  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="flex flex-col items-center gap-6 p-6 rounded-lg backdrop-blur-sm border border-slate-700 bg-slate-900/50 max-w-md">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h3 className="text-lg font-semibold text-slate-100">
            Scene Failed to Load
          </h3>
          <p className="text-sm text-slate-400">
            The 3D scene encountered an error. Please try refreshing the page or click below to retry.
          </p>
          {error && (
            <p className="text-xs text-slate-500 mt-2 font-mono break-words">
              {error.message}
            </p>
          )}
        </div>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Loading
        </button>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        <p className="text-xs text-slate-500">
          If the problem persists, please{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            reload the page
          </button>
          .
        </p>
      </div>
    </div>
  );
};
