import type { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { getServerAuthSession } from "../server/auth";

const Home: NextPage = () => {
  return (
    <>
      <main>
        <div className="flex gap-x-2">
          <Link href="/hr-login" className="button border p-4">
            HR
          </Link>
          <Link href="/employee-login" className="button border p-4">
            Employee
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;

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
