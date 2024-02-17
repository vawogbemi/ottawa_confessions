/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  UserIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import {
  AnonServerClient,
  ServiceServerClient,
  validateUsername,
} from "~/api/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const formErrors = {
    username: validateUsername(formData.username.toString()),
  };

  //if there are errors, we return the form errors
  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  const { supabase } = AnonServerClient(request);

  const { data } = await supabase.auth.getSession();

  const service = ServiceServerClient();

  const { error } = await service
    .from("users")
    .update({ username: formData.username as string })
    .eq("id", data.session?.user.id as string);

  if (error) {
    console.log(error);
    return { formData, formErrors: { username: "Username is unavailable." } };
  }

  //if there are no errors, we return the form data
  return { formData, formErrors: null };
};

export default function Profile() {
  const actionData = useActionData<typeof action>();
  const { user, supabase } = useOutletContext<{
    user:
      | {
          id: string;
          username: string;
          city: string | null;
          school: string | null;
        }
      | null
      | undefined;
    supabase: SupabaseClient<Database>;
  }>();

  return (
    <div className="w-full h-full border-l border-zinc-10 flex flex-wrap">
      <div className="max-w-[400px] flex flex-wrap w-full my-auto mx-auto">
        <form method="post" className="flex flex-wrap gap-y-5 mt-auto w-full">
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Username
              <input
                name="username"
                type="text"
                className="grow"
                placeholder={user?.username}
                autoFocus
              />
            </label>
            {actionData?.formErrors?.username ? (
              <p style={{ color: "red" }}>{actionData?.formErrors?.username}</p>
            ) : null}
          </div>
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2">
              <BuildingOffice2Icon className="w-4 h-4" />
              City
              <input
                name="city"
                type="text"
                className="grow"
                placeholder={user?.city as string}
                disabled
              />
            </label>
          </div>
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4" />
              School
              <input
                name="school"
                type="text"
                className="grow"
                placeholder={user?.school as string}
                disabled
              />
            </label>
          </div>
          <div>
          <button className="btn btn-primary">Update</button>
          <button
        type="button"
          className="btn btn-primary ml-5"
          onClick={() => supabase.auth.signOut()}
        >
          Log Out
        </button>
          </div>
         
        </form>
        
      </div>
    </div>
  );
}
