
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-destructive text-destructive-foreground rounded-full p-3 w-fit">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4 text-2xl font-headline">Oops! Something went wrong.</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => reset()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
