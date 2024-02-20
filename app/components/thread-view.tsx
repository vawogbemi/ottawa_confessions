import { useState } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Link, useSubmit } from "@remix-run/react";

export function ThreadView(props: {
  threads: {
    thread: {
      comments: number;
      content: string;
      created_at: string;
      feed: string;
      id: number;
      likes: number;
      parent1: number | null;
      parent2: number | null;
      user: string;
      user_tag: string;
      username: string;
      views: number;
    };
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
  const { threads, user } = props;
  return threads.map((thread) =>
    thread && thread.thread ? (
      <div key={thread.thread.id} className="w-full lg:w-1/2">
        <ThreadCard key={thread.thread.id} thread={thread} user={user} />
      </div>
    ) : (
      <></>
    )
  );
}

export function ThreadCard(props: {
  thread: {
    thread: {
      comments: number;
      content: string;
      created_at: string;
      feed: string;
      id: number;
      likes: number;
      parent1: number | null;
      parent2: number | null;
      user: string;
      user_tag: string;
      username: string;
      views: number;
    };
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
  const { thread: threadProps, user } = props;
  const { thread, isLiked } = threadProps;
  const [isLikedToggle, setIsLikedToggle] = useState(isLiked);
  const [liked, setLiked] = useState(isLiked);
  const submit = useSubmit();
  return threadProps && thread ? (
    <div
      className="w-full h-[225px] border border-zinc-100 p-3 flex flex-wrap hover:bg-base-200"
      key={thread.id}
    >
      <Link
        to={user ? `/thread/${thread.id}` : "/login"}
        className="w-full h-[90%] flex flex-wrap content-start"
      >
        {/*<p className="text-2xl font-extrabold text-primary text-wrap line-clamp-2">
          {post.title}
         </p>*/}
        <p className="text-primary w-full">
          {`${thread.user_tag}`}{" "}
          <span className="text-zinc-400">{` • ${thread.username}`}</span>
        </p>
        <p className="text-xl font-medium text-pretty line-clamp-4 text-zinc-700 mt-2 w-full">
          {thread.content}
        </p>
      </Link>

      <div className="flex w-full gap-x-5 h-[10%]">
        <div className="flex w-1/2 items-center">
          <button
            className="w-12 h-12 flex items-center rounded-full hover:bg-rose-100"
            type="button"
            onClick={() =>
              user
                ? (setIsLikedToggle(!isLikedToggle),
                  setLiked(!liked),
                  submit(
                    { post: thread.id, user: user.id },
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
              {thread.likes + (liked ? 1 : 0)}
            </p>
          </button>
          <Link
            to={user ? `/thread/${thread.id}` : "/login"}
            className="grow h-full"
          ></Link>
        </div>
        <div className="flex w-1/2 items-center">
          <Link
            to={user ? `/thread/${thread.id}` : "/login"}
            className="flex w-full"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-zinc-400" />
            <p className="text-zinc-400 text-lg ml-1">{thread.comments}</p>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
