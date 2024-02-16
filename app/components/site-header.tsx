import { Link, useLocation } from "@remix-run/react";

const links = ["Ottawa", "Carleton"];
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

  return (
    <div className="fixed w-full bg-white" style={{maxWidth: "inherit"}}>
      <Link to={"/"}>
        <div className="lg:hidden font-bold text-primary text-xl ml-2">
          <p>Ottawa</p>
          <p>Confessions</p>
        </div>
      </Link>
      <div
        className={
          [
            "",
            "/",
            "/ottawa",
            "/ottawa/",
            "/uottawa",
            "/uottawa/",
            "/carletonu",
            "/carletonu/",
          ].includes(pathname)
            ? "flex"
            : "hidden"
        }
      >
        {links.map((link) => (
          <SiteHeaderCard key={link} to={link} user={props.user} />
        ))}
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

  return (
    <Link
      className="py-3 flex-1 border-x border-b border-x-zinc-100 border-b-zinc-100 hover:bg-zinc-300 "
      to={props.user ? `/${props.to.toLowerCase()}` : "/login"}
    >
      <div className="flex">
        <p
          className={`mx-auto ${
            pathname == props.to ? "text-primary" : "text-zinc-500"
          }`}
        >
          {props.to}
        </p>
        {pathname == props.to && <div className="divider bg-primary" />}
      </div>
    </Link>
  );
}
