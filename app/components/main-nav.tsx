import {
  ChevronLeftIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { NavCard } from "./nav-card";
import { useLocation, useNavigate } from "@remix-run/react";

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
  const { user } = props;
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <div
      className="fixed w-full bg-base-100 bottom-0 lg:bottom-auto z-10"
      style={{ maxWidth: "inherit" }}
    >
      <div className="w-full flex flex-wrap gap-x-3">
        {(pathname.startsWith("/post") || pathname.startsWith("/search") || pathname.startsWith("/thread") || pathname.startsWith("/profile")) && (
          <button className="hidden lg:inline mt-2" onClick={() => navigate(-1)}>
            <div className="flex items-center">
              <ChevronLeftIcon className="w-8 h-8" />
              Back
            </div>
          </button>
        )}
        <NavCard icon={<HomeIcon className="w-6 h-6" />} to={"/"} user={user} />
        <NavCard
          icon={<MagnifyingGlassIcon className="w-6 h-6" />}
          to={"/search"}
          user={user}
        />
        <NavCard
          icon={<PencilSquareIcon className="w-6 h-6" />}
          to={"/post/new"}
          user={user}
        />
        <NavCard
          icon={<UserIcon className="w-6 h-6" />}
          to={"/profile"}
          user={user}
        />
      </div>
    </div>
  );
}
