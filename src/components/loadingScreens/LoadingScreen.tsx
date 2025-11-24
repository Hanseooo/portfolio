"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  progress: number;
  loadedCount: number;
  total: number;
  onSkip: () => void;
}

export default function LoadingScreen({
  progress,
  loadedCount,
  total,
  onSkip,
}: LoadingScreenProps) {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md p-6">

      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />

      <p className="text-lg font-semibold text-primary mb-2">
        Loading assets…
      </p>

      <p className="text-sm text-muted-foreground mb-4">
        {loadedCount}/{total} loaded
      </p>

      <Progress value={progress} className="w-64 h-2 rounded-full" />

      {showSkip && (
        <Button 
          variant="ghost"
          className="mt-6 flex items-center gap-2 text-primary/80 hover:text-primary/80 cursor-pointer"
          onClick={onSkip}
        >
          <AlertCircle className="w-4 h-4" />
          Is it loading too long? Skip
        </Button>
      )}
    </div>
  );
}
