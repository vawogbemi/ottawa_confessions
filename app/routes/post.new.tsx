import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useOutletContext, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { createPost } from "~/api/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const content = formData.content as string;

  createPost(
    content,
    formData.id as string,
    formData.username as string,
    formData.city as string,
    formData.school as string
  );
  return redirect("/");
};
export default function NewPost() {
  const { user } = useOutletContext<{
    user:
      | {
          id: string;
          username: string;
          city: string | null;
          school: string | null;
        }
      | null
      | undefined;
  }>();

  const submit = useSubmit();
  const [content, setContent] = useState("");
  const [school, setSchool] = useState("University of Ottawa");
  const [username, setUsername] = useState("Anonymous");
  return (
    <div className="w-full border-l border-zinc-100 flex flex-wrap">
      <div className="w-[400px] mx-auto mt-9">
        <form method="post" className="w-full">
          <label className="form-control p-2 mt-24">
            <div className="label">
              <p className="text-primary w-full">
                <span className="text-zinc-900 text-xl font-bold">{`Confessing as: `}</span>
                {user ? (
                  <div>
                    {`${user?.school}`}
                    <span className="text-zinc-400">{` • ${user?.username}`}</span>
                  </div>
                ) : (
                  <div>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      onChange={(e) => setSchool(e.target.value)}
                    >
                      <option>University of Ottawa</option>
                      <option>Carleton University</option>
                    </select>
                    <label className="input input-bordered flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        className="grow text-zinc-500"
                        placeholder="Anonymous"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </label>
                  </div>
                )}
              </p>
            </div>
            <textarea
              className="textarea textarea-bordered h-24 w-[350px]"
              name="content"
              onChange={(e) => setContent(e.target.value)}
              placeholder=""
            ></textarea>
          </label>
          <button
            className="btn btn-primary ml-2"
            onClick={() =>
              submit(
                {
                  content: content,
                  id: user
                    ? (user?.id as string)
                    : "60687930-2df6-4c75-8d18-03512cd8e6c5",
                  username: user ? (user?.username as string) : username,
                  city: user ? (user?.city as string) : "Ottawa",
                  school: user ? (user?.school as string) : school,
                },
                { method: "post" }
              )
            }
          >
            Confess
          </button>
        </form>
      </div>
    </div>
  );
}
