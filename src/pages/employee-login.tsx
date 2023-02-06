import { signIn } from "next-auth/react";
import { useState } from "react";
import { getServerAuthSession } from "../server/auth";
import { type GetServerSidePropsContext } from "next";

const EmployeeLogin = () => {
  const [employeeLogin, setEmployeeLogin] = useState<{
    uniqueNumber: string;
    password: string;
  }>({
    uniqueNumber: "",
    password: "",
  });

  return (
    <main className="mx-auto max-w-screen-lg py-56 px-4 md:flex">
      <div className="flex flex-1 flex-col justify-center gap-8 p-8">
        <h1 className="text-center text-4xl font-bold">Employee</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void (async () => {
              await signIn("credentials", {
                type: "EMPLOYEE",
                id: employeeLogin.uniqueNumber,
                password: employeeLogin.password,
                callbackUrl: "/employee-dashboard",
              });
            })();
          }}
          className="flex flex-col items-center justify-center gap-y-4"
        >
          <div className="flex gap-x-4">
            <div className="flex flex-col">
              <label htmlFor="unique-number" className="text-sm">
                Unique Number <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Enter your unique number"
                type="number"
                id="unique-number"
                required
                onChange={(e) => {
                  setEmployeeLogin({
                    ...employeeLogin,
                    uniqueNumber: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Enter your password"
                type="password"
                id="password"
                required
                onChange={(e) => {
                  setEmployeeLogin({
                    ...employeeLogin,
                    password: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <button type="submit" className="button w-32 !rounded-full">
            Sign in
          </button>
        </form>
      </div>
      <div className="flex-1 space-y-4 p-8">
        <h1 className="text-8xl font-semibold text-black">Log-in</h1>
        <h1 className="text-8xl font-semibold text-[#206e32]">Upload</h1>
        <h1 className="text-8xl font-semibold text-[#fc0505]">Track</h1>
      </div>
    </main>
  );
};

export default EmployeeLogin;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (session && session.user.role === "EMPLOYEE") {
    return {
      redirect: {
        destination: "/employee-dashboard",
        permanent: false,
      },
    };
  } else if (session && session.user.role === "HR") {
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
