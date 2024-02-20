import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Link, useLocation, useNavigate } from "@remix-run/react";

export function MobileNav() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <div
      className="fixed w-full bg-base-100 lg:hidden z-10 top-auto"
      style={{ maxWidth: "inherit" }}
    >
      <Link to={"/"}>
        <div className="lg:hidden font-bold text-primary text-xl ml-2">
          <p>Ottawa</p>
          <p>Confessions</p>
        </div>
      </Link>
      {(pathname.startsWith("/post") || pathname.startsWith("/search") || pathname.startsWith("/thread") || pathname.startsWith("/profile")) && 
        <button className="mt-2" onClick={() => navigate(-1)}>
          <div className="flex items-center">
            <ChevronLeftIcon className="w-8 h-8" />
            Back
          </div>
        </button>
      }
    </div>
  );
}
