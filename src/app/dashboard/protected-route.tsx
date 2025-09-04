
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/hooks/use-firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useFirebase();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh_-_200px)]">
            <div className="space-y-4 w-full max-w-lg p-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
