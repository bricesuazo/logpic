import { z } from "zod";

import { createTRPCRouter, employeeProcedure } from "../trpc";

export const employeeRouter = createTRPCRouter({
  attendance: employeeProcedure
    .input(
      z.object({
        type: z.enum(["time_in", "break_in", "break_out", "time_out"]),
        imageUrl: z.string(),
        id: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      switch (input.type) {
        case "time_in":
          return ctx.prisma.attendance.create({
            data: {
              employee_id: ctx.session.user.id,
              date: new Date(),
              time_in: new Date(),
              time_in_image: input.imageUrl,
            },
          });
        case "break_in":
          return ctx.prisma.attendance.update({
            where: {
              id: input.id,
            },
            data: {
              break_in: new Date(),
              break_in_image: input.imageUrl,
            },
          });
        case "break_out":
          return ctx.prisma.attendance.update({
            where: {
              id: input.id,
            },
            data: {
              break_out: new Date(),
              break_out_image: input.imageUrl,
            },
          });
        case "time_out":
          return ctx.prisma.attendance.update({
            where: {
              id: input.id,
            },
            data: {
              time_out: new Date(),
              time_out_image: input.imageUrl,
            },
          });
      }
    }),
});
