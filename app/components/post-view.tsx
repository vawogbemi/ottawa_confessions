import { useState } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Link, useSubmit } from "@remix-run/react";

export function PostView(props: {
  posts: {
    post: {
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
    };
    isLiked: boolean;
  }[];
  user: {
    id: string;
    username: string;
    city: string | null;
    school: string | null;
  } | null;
}) {
  const { posts, user } = props;
  return posts.map((post) => (
    <Post key={post.post.id} post={post} user={user} />
  ));
}

export function Post(props: {
  post: {
    post: {
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
    };
    isLiked: boolean;
  };
  user: {
    id: string;
    username: string;
    city: string | null;
    school: string | null;
  } | null;
}) {
  const { post: postProps, user } = props;
  const { post, isLiked } = postProps;
  const [isLikedToggle, setIsLikedToggle] = useState(isLiked);
  const [liked, setLiked] = useState(isLiked);
  const submit = useSubmit();
  return (
    <div
      className="w-full lg:w-1/2 h-[225px] border border-zinc-100 p-3 flex flex-wrap hover:bg-base-200"
      key={post.id}
    >
      <Link
        to={user ? `/post/${post.id}` : "/login"}
        className="w-full h-[90%] flex flex-wrap content-start"
      >
        {/*<p className="text-2xl font-extrabold text-primary text-wrap line-clamp-2">
          {post.title}
         </p>*/}
        <p className="text-primary w-full">{`${post.user_tag} • ${post.username}`}</p>
        <p className="text-xl font-medium text-pretty line-clamp-4 text-zinc-700 mt-2 w-full">
          {post.content}
        </p>
      </Link>

      <div className="flex w-full gap-x-5 h-[10%]">
        <div className="flex w-1/2 items-center">
          <Link to={user ? `/post/${post.id}` : "/login"} className="w-full">
            <button
              className="w-12 h-12 flex items-center z-50"
              type="button"
              onClick={() =>
                user
                  ? (setIsLikedToggle(!isLikedToggle),
                    setLiked(!liked),
                    submit(
                      { post: post.id, user: user.id },
                      { method: "post" }
                    ))
                  : null
              }
            >
              {isLikedToggle ? (
                <HeartIconSolid className="w-6 h-6 text-rose-500" />
              ) : (
                <HeartIconOutline className="w-6 h-6 text-zinc-400 hover:text-rose-500" />
              )}
              <p className="text-zinc-400 text-lg ml-1">
                {post.likes + (liked ? 1 : 0)}
              </p>
            </button>
          </Link>
        </div>
        <div className="flex w-1/2 items-center">
          <Link to={user ? `/post/${post.id}` : "/login"} className="flex">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-zinc-400" />
            <p className="text-zinc-400 text-lg ml-1">{post.comments}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
