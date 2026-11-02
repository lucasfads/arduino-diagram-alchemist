import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // Prerender the root route at `/`; only the browser needs the repository
    // prefix that GitHub Pages adds to the deployed URL.
    basepath:
      typeof window === "undefined" || import.meta.env.BASE_URL === "/"
        ? "/"
        : import.meta.env.BASE_URL.replace(/\/$/, ""),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
