import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter.tsx";

import "./index.css";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getApiErrorMessage } from "./utils/errors.ts";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _vars, _res, mutation) => {
      if (mutation.options.meta?.errorMode === "inline") return;
      toast.error(getApiErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const message = error instanceof Error ? error.message : "";
        if (message.startsWith("HTTP 401")) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const getToasterTheme = () => {
  if (typeof window === "undefined") return "dark";
  const theme = localStorage.getItem("theme");
  if (theme === "light") return "light";
  return "dark";
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" theme={getToasterTheme()} />
    </QueryClientProvider>
  </StrictMode>,
);
