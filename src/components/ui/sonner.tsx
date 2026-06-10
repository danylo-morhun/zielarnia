"use client";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-card text-card-foreground border border-border shadow-lg",
          success: "border-l-4 border-l-success",
          error: "border-l-4 border-l-destructive",
        },
      }}
    />
  );
}
