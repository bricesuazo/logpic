import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Image from "next/image";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>

      {!attendanceQuery.data || attendanceQuery.isLoading ? (
        <>Loading...</>
      ) : (
        <div className="grid grid-cols-4">
          <form
            className="col-span-1"
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
              };
            }}
          >
            <h2>Time In:</h2>
            <p>{new Date().toLocaleDateString()}</p>

            {attendanceQuery.data.time_in ? (
              <p>{attendanceQuery.data.time_in.toLocaleTimeString()}</p>
            ) : (
              <div className="">
                <p>{time ? time : "Loading..."}</p>
                <label htmlFor="time-in-image">Time In Image</label>
                <input
                  type="file"
                  name=""
                  id="time-in-image"
                  required
                  onChange={(e) =>
                    e.target.files && setImages({ timeIn: e.target.files[0] })
                  }
                />
                <button
                  type="submit"
                  className="button"
                  disabled={attendanceMutation.isLoading}
                  // onClick={() => {
                  //   void (async () => {
                  //     await attendanceMutation.mutateAsync({
                  //       id: attendanceQuery.data.id,
                  //       type: "TIME_IN",
                  //       imageBase64: "https://picsum.photos/200",
                  //     });

                  //     setTime(new Date().toLocaleTimeString());

                  //     await attendanceQuery.refetch();
                  //   })();
                  // }}
                >
                  {attendanceMutation.isLoading ? "Loading..." : "Time In"}
                </button>
              </div>
            )}

            <div className="relative aspect-square w-28 object-cover">
              {attendanceQuery.data.time_in_image && (
                <Image src={attendanceQuery.data.time_in_image} alt="" fill />
              )}
            </div>
          </form>
          <div className="col-span-1">
            <h2>Break In:</h2>
            <p>{new Date().toLocaleDateString()}</p>
            {attendanceQuery.data.break_in ? (
              <p>{attendanceQuery.data.break_in.toLocaleTimeString()}</p>
            ) : (
              <div className="">
                <p>{time ? time : "Loading..."}</p>
                <button
                  className="button"
                  disabled={
                    !attendanceQuery.data.time_in ||
                    !!attendanceQuery.data.break_out ||
                    !!attendanceQuery.data.time_out
                  }
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "BREAK_IN",
                        imageBase64: "https://picsum.photos/200",
                        attendanceId: attendanceQuery.data.id,
                      });

                      setTime(new Date().toLocaleTimeString());

                      await attendanceQuery.refetch();
                    })();
                  }}
                >
                  {attendanceMutation.isLoading ? "Loading..." : "Break In"}
                </button>
              </div>
            )}
            <div className="relative aspect-square w-28 object-cover">
              {attendanceQuery.data.break_in_image && (
                <Image src={attendanceQuery.data.break_in_image} alt="" fill />
              )}
            </div>
          </div>
          <div className="col-span-1">
            <h2>Break Out:</h2>
            <p>{new Date().toLocaleDateString()}</p>
            {attendanceQuery.data.break_out ? (
              <p>{attendanceQuery.data.break_out.toLocaleTimeString()}</p>
            ) : (
              <div className="">
                <p>{time ? time : "Loading..."}</p>
                <button
                  className="button"
                  disabled={
                    !attendanceQuery.data.break_in ||
                    !attendanceQuery.data.time_in ||
                    !!attendanceQuery.data.break_out
                  }
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "BREAK_OUT",
                        imageBase64: "https://picsum.photos/200",
                        attendanceId: attendanceQuery.data.id,
                      });

                      setTime(new Date().toLocaleTimeString());

                      await attendanceQuery.refetch();
                    })();
                  }}
                >
                  {attendanceMutation.isLoading ? "Loading..." : "Break Out"}
                </button>
              </div>
            )}
            <div className="relative aspect-square w-28 object-cover">
              {attendanceQuery.data.break_out_image && (
                <Image src={attendanceQuery.data.break_out_image} alt="" fill />
              )}
            </div>
          </div>
          <div className="col-span-1">
            <h2>Time Out:</h2>
            <p>{new Date().toLocaleDateString()}</p>
            {attendanceQuery.data.time_out ? (
              <p>{attendanceQuery.data.time_out.toLocaleTimeString()}</p>
            ) : (
              <div className="">
                <p>{time ? time : "Loading..."}</p>
                <button
                  className="button"
                  disabled={!attendanceQuery.data?.time_in}
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "TIME_OUT",
                        imageBase64: "https://picsum.photos/200",
                        attendanceId: attendanceQuery.data.id,
                      });

                      setTime(new Date().toLocaleTimeString());

                      await attendanceQuery.refetch();
                    })();
                  }}
                >
                  {attendanceMutation.isLoading ? "Loading..." : "Time Out"}
                </button>
              </div>
            )}
            <div className="relative aspect-square w-28 object-cover">
              {attendanceQuery.data.time_out_image && (
                <Image src={attendanceQuery.data.time_out_image} alt="" fill />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
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
