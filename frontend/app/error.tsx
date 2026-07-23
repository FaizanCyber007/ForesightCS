'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function RootError({
  error: _error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      eyebrow="Application error"
      title="Something interrupted the product shell."
      description="Try again or return to the homepage."
      reset={reset}
      homeHref="/"
      homeLabel="Home"
    />
  );
}
