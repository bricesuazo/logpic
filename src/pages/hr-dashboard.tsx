import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { useState } from "react";

const HRDashboard = () => {
  const createEmployeeMutation = api.hr.createEmployee.useMutation();
  const employeesQuery = api.hr.getAllEmployees.useQuery();
  const [employee, setEmployee] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  return (
    <main>
      <h1>HR Dashboard</h1>

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
