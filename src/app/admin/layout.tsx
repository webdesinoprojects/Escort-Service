import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-4">
            <svg
              width="50"
              height="50"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-pulse"
            >
              <circle cx="35" cy="32" r="12" fill="#cf4f41" />
              <path d="M15 75 C 15 50, 55 50, 55 75 Z" fill="#cf4f41" />
              <circle cx="65" cy="32" r="12" fill="#202e4d" />
              <path d="M45 75 C 45 50, 85 50, 85 75 Z" fill="#202e4d" />
            </svg>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-[#cf4f41]" />
              <span>Loading Control Center...</span>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
