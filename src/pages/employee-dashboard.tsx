import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import Image from "next/image";
import Moment from "react-moment";

const EmployeeDashboard = () => {
  const [time, setTime] = useState<string | undefined>();
  const attendanceQuery = api.employee.getAttendanceOrCreate.useQuery();
  const attendanceMutation = api.employee.attendance.useMutation();
  const [images, setImages] = useState<{
    timeIn?: File;
    breakIn?: File;
    breakOut?: File;
    timeOut?: File;
  }>();
  const timeInUploadRef = useRef<HTMLInputElement>(null);
  const breakInUploadRef = useRef<HTMLInputElement>(null);
  const breakOutUploadRef = useRef<HTMLInputElement>(null);
  const timeOutUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="mx-auto max-w-screen-lg space-y-4 p-4 text-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="font-bold">
          <Moment format="dddd, MMMM Do YYYY">{new Date()}</Moment>
        </p>
      </div>

      {!attendanceQuery.data || attendanceQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <form
            noValidate
            className="flex flex-col justify-center gap-y-2 rounded border p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!images?.timeIn) return;

              const reader = new FileReader();
              reader.readAsDataURL(images.timeIn);
              reader.onload = async () => {
                await attendanceMutation.mutateAsync({
                  type: "TIME_IN",
                  imageBase64: reader.result as string,
                  attendanceId: attendanceQuery.data.id,
                });
                setImages({ ...images, timeIn: undefined });
                await attendanceQuery.refetch();
              };
            }}
          >
            <div>
              <h2 className="text-lg font-bold">Time In:</h2>

              {attendanceQuery.data.time_in ? (
                <p>{attendanceQuery.data.time_in.toLocaleTimeString()}</p>
              ) : (
                <div className="space-y-4">
                  <p>{time ? time : "Loading..."}</p>
                  <input
                    type="file"
                    required
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      e.target.files &&
                        setImages({ timeIn: e.target.files[0] });
                      e.target.value = "";
                    }}
                    ref={timeInUploadRef}
                  />
                  <div className="flex flex-col justify-center gap-y-1">
                    <button
                      type="submit"
                      className="button"
                      disabled={attendanceMutation.isLoading || !images?.timeIn}
                    >
                      {attendanceMutation.isLoading ? "Loading..." : "Time In"}
                    </button>

                    <button
                      type="button"
                      className="button text-sm"
                      onClick={() => {
                        !images?.timeIn
                          ? timeInUploadRef.current?.click()
                          : setImages({ ...images, timeIn: undefined });
                      }}
                    >
                      {!images?.timeIn ? "Upload Image" : "Clear"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {images?.timeIn && (
              <div className="relative aspect-square w-full">
                <Image
                  src={URL.createObjectURL(images.timeIn)}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {attendanceQuery.data.time_in_image && (
              <div className="relative aspect-square w-full">
                <Image
                  src={attendanceQuery.data.time_in_image}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </form>

          <form
            noValidate
            className="flex flex-col justify-center gap-y-2 rounded border p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!images?.breakIn) return;

              const reader = new FileReader();
              reader.readAsDataURL(images.breakIn);
              reader.onload = async () => {
                await attendanceMutation.mutateAsync({
                  type: "BREAK_IN",
                  imageBase64: reader.result as string,
                  attendanceId: attendanceQuery.data.id,
                });
                setImages({ ...images, breakIn: undefined });
                await attendanceQuery.refetch();
              };
            }}
          >
            <div>
              <h2 className="text-lg font-bold">Break In:</h2>

              {attendanceQuery.data.break_in ? (
                <p>{attendanceQuery.data.break_in.toLocaleTimeString()}</p>
              ) : (
                <div className="space-y-4">
                  <p>{time ? time : "Loading..."}</p>
                  <input
                    type="file"
                    required
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      e.target.files &&
                        setImages({ breakIn: e.target.files[0] });
                      e.target.value = "";
                    }}
                    ref={breakInUploadRef}
                  />
                  <div className="flex flex-col justify-center gap-y-1">
                    <button
                      type="submit"
                      className="button"
                      disabled={
                        attendanceMutation.isLoading || !images?.breakIn
                      }
                    >
                      {attendanceMutation.isLoading ? "Loading..." : "Break In"}
                    </button>

                    <button
                      type="button"
                      className="button text-sm"
                      disabled={
                        attendanceMutation.isLoading ||
                        !attendanceQuery.data.time_in ||
                        !!attendanceQuery.data.time_out
                      }
                      onClick={() => {
                        !images?.breakIn
                          ? breakInUploadRef.current?.click()
                          : setImages({ ...images, breakIn: undefined });
                      }}
                    >
                      {!images?.breakIn ? "Upload Image" : "Clear"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {images?.breakIn && (
              <div className="relative aspect-square w-full">
                <Image
                  src={URL.createObjectURL(images.breakIn)}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {attendanceQuery.data.break_in_image && (
              <div className="relative aspect-square w-full">
                <Image
                  src={attendanceQuery.data.break_in_image}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </form>

          <form
            noValidate
            className="flex flex-col justify-center gap-y-2 rounded border p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!images?.breakOut) return;

              const reader = new FileReader();
              reader.readAsDataURL(images.breakOut);
              reader.onload = async () => {
                await attendanceMutation.mutateAsync({
                  type: "BREAK_OUT",
                  imageBase64: reader.result as string,
                  attendanceId: attendanceQuery.data.id,
                });
                setImages({ ...images, breakOut: undefined });
                await attendanceQuery.refetch();
              };
            }}
          >
            <div>
              <h2 className="text-lg font-bold">Break Out:</h2>

              {attendanceQuery.data.break_out ? (
                <p>{attendanceQuery.data.break_out.toLocaleTimeString()}</p>
              ) : (
                <div className="space-y-4">
                  <p>{time ? time : "Loading..."}</p>
                  <input
                    type="file"
                    required
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      e.target.files &&
                        setImages({ breakOut: e.target.files[0] });
                      e.target.value = "";
                    }}
                    ref={breakOutUploadRef}
                  />
                  <div className="flex flex-col justify-center gap-y-1">
                    <button
                      type="submit"
                      className="button"
                      disabled={
                        attendanceMutation.isLoading || !images?.breakOut
                      }
                    >
                      {attendanceMutation.isLoading
                        ? "Loading..."
                        : "Break Out"}
                    </button>

                    <button
                      type="button"
                      className="button text-sm"
                      disabled={
                        attendanceMutation.isLoading ||
                        !attendanceQuery.data.break_in ||
                        !!attendanceQuery.data.time_out
                      }
                      onClick={() => {
                        !images?.breakOut
                          ? breakOutUploadRef.current?.click()
                          : setImages({ ...images, breakOut: undefined });
                      }}
                    >
                      {!images?.breakOut ? "Upload Image" : "Clear"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {images?.breakOut && (
              <div className="relative aspect-square w-full">
                <Image
                  src={URL.createObjectURL(images.breakOut)}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {attendanceQuery.data.break_out_image && (
              <div className="relative aspect-square w-full">
                <Image
                  src={attendanceQuery.data.break_out_image}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </form>

          <form
            noValidate
            className="flex flex-col justify-center gap-y-2 rounded border p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!images?.timeOut) return;

              const reader = new FileReader();
              reader.readAsDataURL(images.timeOut);
              reader.onload = async () => {
                await attendanceMutation.mutateAsync({
                  type: "TIME_OUT",
                  imageBase64: reader.result as string,
                  attendanceId: attendanceQuery.data.id,
                });
                setImages({ ...images, timeOut: undefined });
                await attendanceQuery.refetch();
              };
            }}
          >
            <div>
              <h2 className="text-lg font-bold">Time Out:</h2>

              {attendanceQuery.data.time_out ? (
                <p>{attendanceQuery.data.time_out.toLocaleTimeString()}</p>
              ) : (
                <div className="space-y-4">
                  <p>{time ? time : "Loading..."}</p>
                  <input
                    type="file"
                    required
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      e.target.files &&
                        setImages({ timeOut: e.target.files[0] });
                      e.target.value = "";
                    }}
                    ref={timeOutUploadRef}
                  />
                  <div className="flex flex-col justify-center gap-y-1">
                    <button
                      type="submit"
                      className="button"
                      disabled={
                        attendanceMutation.isLoading || !images?.timeOut
                      }
                    >
                      {attendanceMutation.isLoading ? "Loading..." : "Time Out"}
                    </button>

                    <button
                      type="button"
                      className="button text-sm"
                      disabled={
                        attendanceMutation.isLoading ||
                        !attendanceQuery.data.time_in
                      }
                      onClick={() => {
                        !images?.timeOut
                          ? timeOutUploadRef.current?.click()
                          : setImages({ ...images, timeOut: undefined });
                      }}
                    >
                      {!images?.timeOut ? "Upload Image" : "Clear"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {images?.timeOut && (
              <div className="relative aspect-square w-full">
                <Image
                  src={URL.createObjectURL(images.timeOut)}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {attendanceQuery.data.time_out_image && (
              <div className="relative aspect-square w-full">
                <Image
                  src={attendanceQuery.data.time_out_image}
                  alt=""
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </form>
        </div>
      )}
    </main>
  );
};

export default EmployeeDashboard;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/employee-login",
        permanent: false,
      },
    };
  } else if (session.user.role === "HR") {
    return {
      redirect: {
        destination: "/hr-dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
