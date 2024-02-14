import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";

export function MainNav(props: {
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
    <div className="hidden md:flex md:flex-wrap h-screen lg:w-[341px] xl:w-[426px] 2xl:w-[512px]">
      <Link to={"/"} className="mx-auto h-5">
        <p className="text-2xl text-primary font-bold">Ottawa</p>
        <p className="text-2xl text-primary font-bold">Confessions</p>
      </Link>
      <div className="flex flex-wrap gap-2 h-60 my-auto">
        {Object.entries(links).map(([to, value]) => (
          <Link
            key={to}
            to={props.user ? `/${to.toLowerCase()}` : "/login"}
            className="w-full rounded-md flex items-center hover:bg-zinc-300"
          >
            <div className="mx-auto flex text-primary">
              {value}
              <p className="ml-2 text-xl">{to}</p>
            </div>
          </Link>
        ))}
        <Link to={props.user ? "/post" : "/login"} className="mx-auto float-end">
        <button className="btn btn-lg btn-primary p-6">{props.user ? "Post" : "Login"}</button>
      </Link>
      </div>
      
    </div>
  );
}
