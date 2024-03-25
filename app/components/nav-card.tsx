import { Link, useLocation } from "@remix-run/react";

export function NavCard(props: {
  icon: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  to: string;
  user:
    | {
        id: string;
        username: string;
        city: string | null;
        school: string | null;
      }
    | null
    | undefined;
}) {
  const pathname = useLocation().pathname;
  const { icon, to } = props;
  return (
    <Link
      className="py-3 flex-1  hover:bg-zinc-100 rounded-md "
      to={`${to.toLowerCase()}`}
    >
      <div className="flex">
        <div
          className={`mx-auto my-auto ${
            pathname.endsWith(to.toLowerCase())
              ? "text-zinc-900"
              : "text-zinc-400"
          }`}
        >
          {<>{icon}</>}
        </div>
      </div>
    </Link>
  );
}

export function AuthNavCard(props: {
  icon: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  to: string;
  user:
    | {
        id: string;
        username: string;
        city: string | null;
        school: string | null;
      }
    | null
    | undefined;
}) {
  const pathname = useLocation().pathname;
  const { icon, user, to } = props;
  return (
    <Link
      className="py-3 flex-1  hover:bg-zinc-100 rounded-md "
      to={
        user ? `${to.toLowerCase()}` : to.toLowerCase() == "/" ? "/" : "/login"
      }
    >
      <div className="flex">
        <div
          className={`mx-auto my-auto ${
            pathname.endsWith(to.toLowerCase())
              ? "text-zinc-900"
              : "text-zinc-400"
          }`}
        >
          {<>{icon}</>}
        </div>
      </div>
    </Link>
  );
}
