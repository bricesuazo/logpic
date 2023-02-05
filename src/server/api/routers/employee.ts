import { z } from "zod";

import { createTRPCRouter, employeeProcedure } from "../trpc";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../../../utils/firebase";

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
        imageBase64: z.string(),
        attendanceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      switch (input.type) {
        case "TIME_IN":
          const timeInImageRef = ref(
            storage,
            "attendance/" +
              new Date().getFullYear().toString() +
              "-" +
              (new Date().getMonth() + 1).toString() +
              "-" +
              new Date().getUTCDate().toString() +
              "/" +
              ctx.session.user.id +
              "/time_in/" +
              new Date().getTime().toString()
          );

          return await uploadString(
            timeInImageRef,
            input.imageBase64,
            "data_url"
          ).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
              await ctx.prisma.attendance.update({
                where: {
                  id: input.attendanceId,
                },
                data: {
                  employee_id: ctx.session.user.id,
                  date: new Date().toLocaleDateString(),
                  time_in: new Date(),
                  time_in_image: url,
                },
              });
            });
          });

        case "BREAK_IN":
          const breakInImageRef = ref(
            storage,
            "attendance/" +
              new Date().getFullYear().toString() +
              "-" +
              (new Date().getMonth() + 1).toString() +
              "-" +
              new Date().getUTCDate().toString() +
              "/" +
              ctx.session.user.id +
              "/break_in/" +
              new Date().getTime().toString()
          );

          return await uploadString(
            breakInImageRef,
            input.imageBase64,
            "data_url"
          ).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
              await ctx.prisma.attendance.update({
                where: {
                  id: input.attendanceId,
                },
                data: {
                  employee_id: ctx.session.user.id,
                  date: new Date().toLocaleDateString(),
                  break_in: new Date(),
                  break_in_image: url,
                },
              });
            });
          });
        case "BREAK_OUT":
          const breakOutImageRef = ref(
            storage,
            "attendance/" +
              new Date().getFullYear().toString() +
              "-" +
              (new Date().getMonth() + 1).toString() +
              "-" +
              new Date().getUTCDate().toString() +
              "/" +
              ctx.session.user.id +
              "/break_out/" +
              new Date().getTime().toString()
          );

          return await uploadString(
            breakOutImageRef,
            input.imageBase64,
            "data_url"
          ).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
              await ctx.prisma.attendance.update({
                where: {
                  id: input.attendanceId,
                },
                data: {
                  employee_id: ctx.session.user.id,
                  date: new Date().toLocaleDateString(),
                  break_out: new Date(),
                  break_out_image: url,
                },
              });
            });
          });
        case "TIME_OUT":
          const timeOutImageRef = ref(
            storage,
            "attendance/" +
              new Date().getFullYear().toString() +
              "-" +
              (new Date().getMonth() + 1).toString() +
              "-" +
              new Date().getUTCDate().toString() +
              "/" +
              ctx.session.user.id +
              "/time_out/" +
              new Date().getTime().toString()
          );

          return await uploadString(
            timeOutImageRef,
            input.imageBase64,
            "data_url"
          ).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
              await ctx.prisma.attendance.update({
                where: {
                  id: input.attendanceId,
                },
                data: {
                  employee_id: ctx.session.user.id,
                  date: new Date().toLocaleDateString(),
                  time_out: new Date(),
                  time_out_image: url,
                },
              });
            });
          });
      }
    }),
});
