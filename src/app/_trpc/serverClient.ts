import { AppRouter, appRouter } from "@/trpc";
import { httpBatchLink } from "@trpc/client";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "production"
          ? "https://quill-ebon.vercel.app//api/trpc"
          : "http://localhost:3000/api/trpc",
    }),
  ],
});
