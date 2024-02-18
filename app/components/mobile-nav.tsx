import { Link } from "@remix-run/react";

export function MobileNav() {
  return (
    <div className="fixed w-full bg-base-100 lg:hidden z-10 top-auto" style={{ maxWidth: "inherit" }}>
      <Link to={"/"}>
        <div className="lg:hidden font-bold text-primary text-xl ml-2">
          <p>Ottawa</p>
          <p>Confessions</p>
        </div>
      </Link>
    </div>
  );
}
