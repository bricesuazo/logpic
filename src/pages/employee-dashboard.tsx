import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";

const EmployeeDashboard = () => {
  return <div>employee-dashboard</div>;
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
