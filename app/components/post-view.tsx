import { useState } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

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
      title: string;
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
      title: string;
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
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="w-full lg:w-1/2 h-[225px] border border-zinc-100 p-3 flex flex-wrap"
      key={post.id}
    >
      <Link to={user ? `post/${post.id}` : "/login"} className="w-full h-[90%]">
        {" "}
        <p className="text-2xl font-extrabold text-primary text-wrap line-clamp-2">
          {post.title}
        </p>
        <p className="text-primary">{`${post.user_tag} • ${post.username}`}</p>
        <p className="text-lg font-medium text-pretty line-clamp-3 text-zinc-400 mt-2">
          {post.content}
        </p>
      </Link>

      <div className="flex w-full gap-x-5 h-[10%]">
        <div className="flex w-1/2 items-center">
          <button
            className="w-full h-full flex items-center"
            onClick={() => user ? (setIsLikedToggle(!isLikedToggle), setLiked(!liked)) : null}
          >
            {isLikedToggle ? (
              <HeartIconSolid className="w-6 h-6 text-rose-500" />
            ) : (
              <HeartIconOutline className="w-6 h-6 text-zinc-400" />
            )}
            <p className="text-zinc-400 text-lg ml-1">
              {post.likes + (liked ? 1 : 0)}
            </p>
          </button>
        </div>
        <div className="flex w-1/2 items-center">
          <Link to={user ? `post/${post.id}` : "/login"} className="flex">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-zinc-400" />
            <p className="text-zinc-400 text-lg ml-1">{post.comments}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
