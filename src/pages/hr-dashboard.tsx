import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { useState, useEffect } from "react";
import Moment from "react-moment";
import ImageModal from "../components/ImageModal";

const HRDashboard = () => {
  const createEmployeeMutation = api.hr.createEmployee.useMutation();
  const employeesQuery = api.hr.getAllEmployeesWithAttendanceToday.useQuery();
  const [date, setDate] = useState<Date | undefined>();
  const [isOpenModal, setOpenModal] = useState({ link: "", isOpen: false });
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [employee, setEmployee] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  return (
    <>
      <ImageModal
        isOpen={isOpenModal.isOpen}
        link={isOpenModal.link}
        setIsOpen={() => {
          setOpenModal({ link: "", isOpen: false });
        }}
      />
      <main className="mx-auto max-w-screen-lg space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
          <p>
            <Moment format="MMMM Do YYYY, h:mm:ss A">{date}</Moment>
          </p>
        </div>
        <table className="w-full rounded border text-left text-sm">
          <thead className="text-xs ">
            <tr className="border-b">
              {[
                { id: 0, title: "ID" },
                { id: 1, title: "Name" },
                { id: 2, title: "Time In" },
                { id: 3, title: "Break In" },
                { id: 4, title: "Break Out" },
                { id: 5, title: "Time Out" },
              ].map((thead) => (
                <th
                  key={thead.id}
                  scope="col"
                  className={`px-2 py-1 sm:px-6 sm:py-4 ${
                    thead.id === 1 ? "hidden sm:block" : ""
                  }`}
                >
                  {thead.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-visible">
            {employeesQuery.data?.map((employee) => (
              <tr key={employee.id} className="border-b text-xs sm:text-sm">
                <td className="px-2 py-1 hover:bg-green-50 sm:px-6 sm:py-4">
                  {employee.id}
                </td>
                <td className="hidden px-2 py-1 hover:bg-green-50 sm:block sm:px-6 sm:py-4">
                  {employee.first_name + " " + employee.last_name}
                </td>
                <td
                  className="cursor-pointer px-2 py-1 hover:bg-green-50 sm:px-6 sm:py-4"
                  onClick={() => {
                    employee.Attendance[0]?.time_in &&
                      employee.Attendance[0]?.time_in_image &&
                      setOpenModal({
                        link: employee.Attendance[0]?.time_in_image,
                        isOpen: true,
                      });
                  }}
                >
                  {employee.Attendance[0]?.time_in?.toLocaleTimeString()}
                </td>
                <td
                  className="cursor-pointer px-2 py-1 hover:bg-green-50 sm:px-6 sm:py-4"
                  onClick={() => {
                    employee.Attendance[0]?.break_in &&
                      employee.Attendance[0]?.break_in_image &&
                      setOpenModal({
                        link: employee.Attendance[0]?.break_in_image,
                        isOpen: true,
                      });
                  }}
                >
                  {employee.Attendance[0]?.break_in?.toLocaleTimeString()}
                </td>
                <td
                  className="cursor-pointer px-2 py-1 hover:bg-green-50 sm:px-6 sm:py-4"
                  onClick={() => {
                    employee.Attendance[0]?.break_out &&
                      employee.Attendance[0]?.break_out_image &&
                      setOpenModal({
                        link: employee.Attendance[0]?.break_out_image,
                        isOpen: true,
                      });
                  }}
                >
                  {employee.Attendance[0]?.break_out?.toLocaleTimeString()}
                </td>
                <td
                  className="cursor-pointer px-2 py-1 hover:bg-green-50 sm:px-6 sm:py-4"
                  onClick={() => {
                    employee.Attendance[0]?.time_out &&
                      employee.Attendance[0]?.time_out_image &&
                      setOpenModal({
                        link: employee.Attendance[0]?.time_out_image,
                        isOpen: true,
                      });
                  }}
                >
                  {employee.Attendance[0]?.time_out?.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Create Employee</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();

            void (async () => {
              await createEmployeeMutation.mutateAsync({
                id: employee.id,
                email: employee.email,
                first_name: employee.first_name,
                last_name: employee.last_name,
                password: employee.password,
              });

              await employeesQuery.refetch();

              setEmployee({
                id: "",
                email: "",
                first_name: "",
                last_name: "",
                password: "",
              });
            })();
          }}
        >
          <div className="flex items-center gap-x-2">
            <label htmlFor="unique-id-number">Unique ID Number</label>
            <input
              required
              type="text"
              id="unique-id-number"
              value={employee.id}
              onChange={(e) => {
                setEmployee({ ...employee, id: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="first-name">First Name</label>
            <input
              required
              type="text"
              id="first-name"
              value={employee.first_name}
              onChange={(e) => {
                setEmployee({ ...employee, first_name: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="last-name">Last Name</label>
            <input
              required
              type="text"
              id="last-name"
              value={employee.last_name}
              onChange={(e) => {
                setEmployee({ ...employee, last_name: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              id="email"
              value={employee.email}
              onChange={(e) => {
                setEmployee({ ...employee, email: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              value={employee.password}
              onChange={(e) => {
                setEmployee({ ...employee, password: e.target.value });
              }}
            />
          </div>
          <button type="submit" className="button">
            Create
          </button>
        </form>

        {createEmployeeMutation.isLoading && <p>Loading...</p>}
        {createEmployeeMutation.isError && (
          <p>Error: {createEmployeeMutation.error.message}</p>
        )}

        {createEmployeeMutation.isSuccess && (
          <p>Employee created successfully!</p>
        )}

        <h3>Employees</h3>
        <ul>
          {!employeesQuery.data ? (
            <>No employees</>
          ) : (
            employeesQuery.data.map((employee) => (
              <li key={employee.id}>{employee.first_name}</li>
            ))
          )}
        </ul>
      </main>
    </>
  );
};

export default HRDashboard;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/hr-login",
        permanent: false,
      },
    };
  } else if (session.user.role === "EMPLOYEE") {
    return {
      redirect: {
        destination: "/employee-dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
