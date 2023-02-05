import { createTRPCRouter } from "./trpc";
import { hrRouter } from "./routers/hr";
import { employeeRouter } from "./routers/employee";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  hr: hrRouter,
  employee: employeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
