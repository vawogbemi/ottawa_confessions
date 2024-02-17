import { Link, useLocation } from "@remix-run/react";
import { Fragment } from "react";

export function SiteHeader(props: {
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
  const { user } = props;

  return (
    <div className="fixed w-full bg-base-100" style={{ maxWidth: "inherit" }}>
      <Link to={"/"}>
        <div className="lg:hidden font-bold text-primary text-xl ml-2">
          <p>Ottawa</p>
          <p>Confessions</p>
        </div>
      </Link>
      <div
        className={
          [
            "/login",
            "/login/",
            "/profile",
            "/profile/",
            "/post",
            "/post/"
          ].includes(pathname)
            ? "hidden"
            : "hidden"
        }
      >
        {user && user.city && user.school ? (
          <Fragment>
            <SiteHeaderCard to={user?.city} user={props.user} />
            <SiteHeaderCard to={user?.school} user={props.user} />{" "}
          </Fragment>
        ) : (
          <Fragment>
            <SiteHeaderCard to={"Ottawa"} user={props.user} />
            <SiteHeaderCard to={"uOttawa/Carleton"} user={props.user} />{" "}
          </Fragment>
        )}
      </div>
    </div>
  );
}

export function SiteHeaderCard(props: {
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
  const {user, to} = props
  return (
    <Link
      className="py-3 flex-1 border-x border-b border-x-zinc-100 border-b-zinc-100 hover:bg-zinc-300 "
      to={user ? `/${to.toLowerCase()}` : "/login"}
    >
      <div className="flex">
        <p
          className={`mx-auto ${
            pathname == to ? "text-primary" : "text-zinc-500"
          }`}
        >
          {props.to}
        </p>
      </div>
      {(pathname.endsWith(to.toLowerCase()) || (to.toLowerCase() == "ottawa" && pathname == "/") ) && (
        <div className="divider divider-primary w-1/3 h-2 m-0 mx-auto"></div>
      )}
    </Link>
  );
}
