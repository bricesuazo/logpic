import { z } from "zod";

import { createTRPCRouter, employeeProcedure } from "../trpc";

export const employeeRouter = createTRPCRouter({
  getAttendanceOrCreate: employeeProcedure.query(async ({ ctx }) => {
    const attendance = await ctx.prisma.attendance.findFirst({
      where: {
        employee_id: ctx.session.user.id,
        date: new Date().toLocaleDateString(),
      },
      take: 1,
    });
    if (!attendance) {
      return ctx.prisma.attendance.create({
        data: {
          employee_id: ctx.session.user.id,
          date: new Date().toLocaleDateString(),
        },
      });
    }

    return attendance;
  }),
  attendance: employeeProcedure
    .input(
      z.object({
        type: z.enum(["TIME_IN", "BREAK_IN", "BREAK_OUT", "TIME_OUT"]),
        imageUrl: z.string(),
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      switch (input.type) {
        case "TIME_IN":
          return ctx.prisma.attendance.update({
            where: {
              id: input.id,
            },
            data: {
              employee_id: ctx.session.user.id,
              date: new Date().toLocaleDateString(),
              time_in: new Date(),
              time_in_image: input.imageUrl,
            },
          });
        case "BREAK_IN":
          return ctx.prisma.attendance.update({
            where: {
              id: input.id,
            },
            data: {
              break_in: new Date(),
              break_in_image: input.imageUrl,
            },
          });
        case "BREAK_OUT":
          return ctx.prisma.attendance.update({
            where: {
              id: input.id,
            },
            data: {
              break_out: new Date(),
              break_out_image: input.imageUrl,
            },
          });
        case "TIME_OUT":
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
