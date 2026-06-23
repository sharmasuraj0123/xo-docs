"use client";

import type { PostHogConfig } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const posthogOptions: Partial<PostHogConfig> = {
  // Use reverse proxy to avoid ad-blockers
  api_host: "/ingest",
  capture_pageview: false,
  autocapture: true,
  session_recording: {
    maskAllInputs: true,
  },
};

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PHProvider apiKey={posthogKey} options={posthogOptions}>
      {children}
    </PHProvider>
  );
}
