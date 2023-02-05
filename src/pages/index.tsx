import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <main>
        <div className="flex gap-x-2">
          <Link href="/hr-login">HR</Link>
          <Link href="/employee-login">Employee</Link>
        </div>
      </main>
    </>
  );
};

export default Home;
