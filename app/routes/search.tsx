/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-autofocus */
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Outlet, useLocation, useOutletContext } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  let searchTerm = formData.searchTerm as string;
  while (searchTerm.charAt(0) === "/") {
    searchTerm = searchTerm.substring(1);
    return redirect(searchTerm);
  }
  return redirect(searchTerm);
};

export default function Search() {
  const pathname = useLocation().pathname;

  const { user } = useOutletContext<{
    user: {
      id: string;
      username: string;
      city: string | null;
      school: string | null;
    } | null;
  }>();

  return (
    <div className="w-full flex flex-wrap border-l border-zinc-100">
      <form
        method="post"
        action="/search"
        className="mx-auto mt-40 -mb-20 lg:mt-20 lg:-mb-10 flex"
      >
        <label className="input input-bordered flex items-center z-50 gap-2">
          <MagnifyingGlassIcon className="w-4 h-4" />
          <input
            name="searchTerm"
            type="text"
            className="grow w-60"
            defaultValue={decodeURIComponent(pathname).split("/").at(2)}
            autoFocus
          />
        </label>
        <button className="btn btn-primary ml-5 z-50">Search</button>
      </form>

      {pathname != ("/search" || "/search/") && <Outlet context={{ user }} />}
    </div>
  );
}
