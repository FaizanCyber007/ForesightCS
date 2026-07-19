'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/components/ui/error-state';

export default function CustomerError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      eyebrow="Customer 360 error"
      title="The account view could not be loaded."
      description="The telemetry payload was unavailable. Retry or return to the dashboard."
      reset={reset}
      homeHref="/dashboard"
      homeLabel="Back to dashboard"
    />
  );
}
