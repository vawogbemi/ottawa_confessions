import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";

export function MobileNav(props: {
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
  const links = {
    Search: <MagnifyingGlassIcon className="w-6 h-6 text-primary" />,
    Profile: <UserIcon className="w-6 h-6 text-primary" />,
    //Notifications
    //Bookmarks
  };
  return (
    <div className="md:hidden w-full flex flex-wrap gap-2 max-h-20 fixed bottom-0 z-50 bg-white border-t border-zinc-300 items-center">
      {Object.entries(links).map(([to, value]) => (
        <Link
          key={to}
          to={props.user ? `/${to.toLowerCase()}` : "/login"}
          className="rounded-md flex items-center hover:bg-zinc-300 mx-auto px-7"
        >
          <div className="mx-auto flex text-primary">{value}</div>
        </Link>
      ))}
      <Link to={props.user ? "/post/new" : "/login"} className="mx-auto px-7 h-full">
        <button className="btn btn-primary">
          {props.user ? "Post" : "Login"}
        </button>
      </Link>
    </div>
  );
}
