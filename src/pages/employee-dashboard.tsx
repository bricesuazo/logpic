import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const EmployeeDashboard = () => {
  const [time, setTime] = useState<string | undefined>();
  const attendanceQuery = api.employee.getAttendance.useQuery();
  const attendanceMutation = api.employee.attendance.useMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>
      {!attendanceQuery.data ? (
        <>No attendance</>
      ) : attendanceQuery.isLoading ? (
        <>Loading...</>
      ) : (
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <h2>Time In:</h2>
            <p>{new Date().toLocaleDateString()}</p>

            {attendanceQuery.data.time_in ? (
              <p>{attendanceQuery.data.time_in.toLocaleTimeString()}</p>
            ) : (
              <div className="">
                <p>{time ? time : "Loading..."}</p>
                <button
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "TIME_IN",
                        imageUrl: "https://picsum.photos/200",
                      });

                      setTime(new Date().toLocaleTimeString());

                      await attendanceQuery.refetch();
                    })();
                  }}
                >
                  {attendanceMutation.isLoading ? "Loading..." : "Time In"}
                </button>
              </div>
            )}
          </div>
          <div className="col-span-1">
            <h2>Break In:</h2>
            <p>{new Date().toLocaleDateString()}</p>
            {attendanceQuery.data.break_in ? (
              <p>{attendanceQuery.data.break_in.toLocaleTimeString()}</p>
            ) : (
              <div className="">
                <p>{time ? time : "Loading..."}</p>
                <button
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "BREAK_IN",
                        imageUrl: "https://picsum.photos/200",
                        id: attendanceQuery.data?.id,
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
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "BREAK_OUT",
                        imageUrl: "https://picsum.photos/200",
                        id: attendanceQuery.data?.id,
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
                  onClick={() => {
                    void (async () => {
                      await attendanceMutation.mutateAsync({
                        type: "TIME_OUT",
                        imageUrl: "https://picsum.photos/200",
                        id: attendanceQuery.data?.id,
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
