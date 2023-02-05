import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const session = useSession();
  return (
    <header className="flex items-center justify-between bg-green-800 p-4 text-white">
      <Link href="/">
        <h1>LogPic</h1>
      </Link>
      {session.status === "authenticated" && (
        <div className="flex items-center gap-x-2">
          <p>{session.data.user.id}</p>
          <button
            className="rounded bg-green-600 p-2"
            onClick={() =>
              void (async () => {
                await signOut({ callbackUrl: "/" });
              })()
            }
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
