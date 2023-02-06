import type { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { getServerAuthSession } from "../server/auth";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <main>
      <div className="relative">
        <div className="absolute z-10 flex h-full flex-col items-center text-white sm:flex-row">
          <h1 className="flex flex-1 items-center p-8 text-center text-4xl font-bold sm:text-left sm:text-6xl">
            Digital Daily Time Record
          </h1>
          <div className="flex h-full flex-1 flex-col justify-center bg-green-600/90 p-8">
            <p className="text-lg">
              <span className="font-bold">
                LOGPIC is a system wherein you can take your daily attendance
                with just a click!
              </span>{" "}
              Assuring transparency between you and your employer by using our
              unique feature — add a photo attachment for proof.
            </p>
          </div>
        </div>
        <div className="relative h-96 w-full">
          <Image
            src="/cvsu.jpg"
            alt=""
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-8 py-32 px-8">
        <Image
          src="/logo.png"
          alt=""
          width={256}
          height={256}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <hr className="h-1 w-36 bg-black" />
        <h1 className="text-4xl font-bold">Log-in your Account</h1>
        <div className="flex items-center gap-x-4">
          <Link href="/hr-login" className="button w-48 border p-4 text-center">
            Human Resources
          </Link>
          <Link
            href="/employee-login"
            className="button w-48 border p-4 text-center"
          >
            Employee
          </Link>
        </div>
      </div>
    </main>
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
