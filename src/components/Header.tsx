import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const session = useSession();
  return (
    <header className="flex items-center justify-between bg-green-900 p-4">
      <Link href="/">
        <h1>LogPic</h1>
      </Link>
      {session.status === "authenticated" && (
        <div>
          <p>{session.data.user.id}</p>
          <button
            onClick={() =>
              void (async () => {
                await signOut();
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
