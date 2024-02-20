import { ActionFunctionArgs } from "@remix-run/node";
import { useOutletContext, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { createPost } from "~/api/server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = Object.fromEntries(await request.formData());
  
    const post = parseInt(formData.post as string);
    const user = formData.user as string;
  
    const reply = formData.reply as string;

     
    return null
  
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

  const submit = useSubmit()
  const [content, setContent] = useState("")

  return (
    <div className="w-full border-l border-zinc-100 flex flex-wrap">
      <div className="w-[400px] mx-auto mt-9">
        <form method="post" className="w-full">
          <label className="form-control p-2 mt-24">
            <div className="label">
              <p className="text-primary w-full">
                <span className="text-zinc-900 text-xl font-bold">{`Confessing as: `}</span>
                {`${user?.school}`}
                <span className="text-zinc-400">{` • ${user?.username}`}</span>
              </p>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              name="content"
              onChange={(e)=>setContent(e.target.value)}
              placeholder="Osmows is the best shawarma, this is not an ad btw, but they should pay me."
            ></textarea>
          </label>
          <button className="btn btn-primary ml-2" onClick={() => submit({contet: content, user: user!}, {method: "post"})}>Confess</button>
        </form>
      </div>
    </div>
  );
}
