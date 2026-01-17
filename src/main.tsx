import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import './index.css'
import App from './App.tsx'

import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error("Missing VITE_CONVEX_URL environment variable!");
  // This will be caught by the ErrorBoundary if we render it, 
  // but since we are outside the render tree, we need to handle it or let it fail gracefully inside.
  // Actually, let's create the client safely and check inside the render or just throw here 
  // but throwing here will cause a white screen if we don't have a root error boundary.
  // Better approach: Throw inside the root to trigger boundary.
}

// We interpret empty string as missing too
const convex = new ConvexReactClient(convexUrl || "https://placeholder-url-to-prevent-crash.convex.cloud");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* We verify the URL here to trigger the boundary in the UI */}
      {!convexUrl ? (
        <ThrowError message="Missing Environment Variable: VITE_CONVEX_URL. Please set this in your Netlify Site Settings." />
      ) : (
        <ConvexProvider client={convex}>
          <App />
        </ConvexProvider>
      )}
    </ErrorBoundary>
  </StrictMode>,
)

function ThrowError({ message }: { message: string }) {
  throw new Error(message);
  return null;
}
