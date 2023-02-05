import { type NextPage } from "next";
import Link from "next/link";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const wefse = api.employee.attendance.useMutation();
  // wefse.mutate({
  //   type: "time_in",
  // });
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
