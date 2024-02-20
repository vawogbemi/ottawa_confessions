import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { createComment, fetchPost, verifyLike } from "~/api/server";

import { PostCard } from "~/components/post-view";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const post = parseInt(formData.post as string);

  const reply = formData.reply as string;

  if (post){
    const user = formData.user as string;

    return verifyLike(post, user!);

  }

  const user = formData.user 

  return createComment(post, reply, user!)

};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const post = await fetchPost(request, params.post!);
  const comments = await fetchComments(request, params.post!)
  return json({ post });
};

export default function Post() {
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

  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="w-full flex flex-wrap">
      <form className="w-full" method="post">
        <div className="w-full pt-24 lg:mt-14 mx-auto">
          {post && post.post ? (
            <PostCard post={post} user={user} hover={false} />
          ) : (
            <></>
          )}
        </div>
        
        <label className="form-control p-2">
          <div className="label">
            <p className="text-primary w-full">
            <span className="text-zinc-900 text-xl font-bold">{`Replying as: `}</span>
              {`${user?.school}`}
              <span className="text-zinc-400">{` • ${user?.username}`}</span>
            </p>
          </div>
          <textarea
            className="textarea textarea-bordered h-24"
            name="reply"
            placeholder="Your reply here"
          ></textarea>
        </label>
        <button className="btn btn-primary ml-2">Reply</button>

      </form>
    </div>
  );
}
