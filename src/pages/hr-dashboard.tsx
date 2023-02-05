import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";

const HRDashboard = () => {
  return <div>HR-dashboard</div>;
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
