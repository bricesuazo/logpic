import { z } from "zod";

import { createTRPCRouter, hrProcedure } from "../trpc";

export const hrRouter = createTRPCRouter({
  createEmployee: hrProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        first_name: z.string(),
        last_name: z.string(),
        password: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.employee.create({
        data: {
          id: input.id,
          email: input.email,
          first_name: input.first_name,
          last_name: input.last_name,
          password: input.password,
        },
      });
    }),
});
