import { signIn } from "next-auth/react";
import { useState } from "react";
import { getServerAuthSession } from "../server/auth";
import { type GetServerSidePropsContext } from "next";

const HRLogin = () => {
  const [employeeLogin, setEmployeeLogin] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  return (
    <div>
      <h1>HR Login</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          void (async () => {
            await signIn("credentials", {
              type: "HR",
              id: employeeLogin.email,
              password: employeeLogin.password,
              callbackUrl: "/hr-dashboard",
            });
          })();
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          onChange={(e) => {
            setEmployeeLogin({
              ...employeeLogin,
              email: e.target.value,
            });
          }}
        />
        <label htmlFor="password">Password</label>
        <input
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default HRLogin;

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
