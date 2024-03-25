import { useState } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { useSubmit } from "@remix-run/react";
import { relativeDate } from "~/api/server";

export function PostView(props: {
  posts: {
    post:
      | {
          city: string;
          comments: number;
          content: string;
          created_at: string;
          feed: string | null;
          id: number;
          likes: number;
          school: string;
          user: string;
          user_tag: string;
          username: string;
          views: number;
        }
      | undefined;
    isLiked: boolean;
  }[];
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
  const { posts, user } = props;
  return posts.map((post) =>
    post && post.post ? (
      <div key={post.post.id} className="w-full lg:w-1/2">
        <PostCard key={post.post.id} post={post} user={user} />
      </div>
    ) : (
      <></>
    )
  );
}

export function PostCard(props: {
  post: {
    post:
      | {
          city: string;
          comments: number;
          content: string;
          created_at: string;
          feed: string | null;
          id: number;
          likes: number;
          school: string;
          user: string;
          user_tag: string;
          username: string;
          views: number;
        }
      | undefined;
    isLiked: boolean;
  };
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
  const { post: postProps, user } = props;
  const { post, isLiked } = postProps;
  const [isLikedToggle, setIsLikedToggle] = useState(isLiked);
  const [liked, setLiked] = useState(isLiked);
  const submit = useSubmit();
  return postProps && post ? (
    <div
      className="w-full h-[225px] border border-zinc-100 p-3 flex flex-wrap hover:bg-base-200"
      key={post.id}
    >
      <div className="w-full h-[90%] flex flex-wrap content-start">
        {/*<p className="text-2xl font-extrabold text-primary text-wrap line-clamp-2">
          {post.title}
         </p>*/}
        <p className="text-primary w-full">
          {`${post.user_tag}`}{" "}
          <span className="text-zinc-400">{` • ${post.username}`}</span>
        </p>
        <p>{relativeDate(new Date(post.created_at))}</p>
        <p className="text-xl font-medium text-pretty line-clamp-4 text-zinc-700 mt-2 w-full">
          {post.content}
        </p>
      </div>

      <div className="flex w-full gap-x-5 h-[10%]">
        <div className="flex w-1/2 items-center">
          <button
            className="w-12 h-12 flex items-center rounded-full hover:bg-rose-100"
            type="button"
            onClick={() =>
              user
                ? (setIsLikedToggle(!isLikedToggle),
                  setLiked(!liked),
                  submit({ post: post.id, user: user.id }, { method: "post" }))
                : (setIsLikedToggle(!isLikedToggle),
                  setLiked(!liked),
                  submit({ post: post.id, user: null }, { method: "post" }))
            }
          >
            {isLikedToggle ? (
              <HeartIconSolid className="w-6 h-6 text-rose-500" />
            ) : (
              <HeartIconOutline className="w-6 h-6 text-zinc-400 hover:text-rose-500" />
            )}
            <p className="text-zinc-400 text-lg ml-1">
              {Math.max(
                post.likes + (liked ? 1 : 0) - (post.user == user?.id ? 1 : 0),
                0
              )}
            </p>
          </button>
        </div>
        <div className="flex w-1/2 items-center"></div>
      </div>
    </div>
  ) : (
    <></>
  );
}
