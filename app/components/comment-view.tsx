import { ChatBubbleLeftRightIcon } from "@heroicons/react/16/solid";
import {, useSubmit } from "@remix-run/react";
import { useState } from "react";

export function CommentCard(props: {
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
    const { comment: commentProps, user } = props;
    const { comment, isLiked } = commentProps;
    const [isLikedToggle, setIsLikedToggle] = useState(isLiked);
    const [liked, setLiked] = useState(isLiked);
    const submit = useSubmit();
    return commentProps && comment ? (
      <div
        className="w-full h-[225px] border border-zinc-100 p-3 flex flex-wrap hover:bg-base-200"
        key={comment.id}
      >
        <div
          to={user ? `/post/${comment.id}` : "/login"}
          className="w-full h-[90%] flex flex-wrap content-start"
        >
          {/*<p className="text-2xl font-extrabold text-primary text-wrap line-clamp-2">
            {post.title}
           </p>*/}
          <p className="text-primary w-full">
            {`${comment.user_tag}`}{" "}
            <span className="text-zinc-400">{` • ${comment.username}`}</span>
          </p>
          <p className="text-xl font-medium text-pretty line-clamp-4 text-zinc-700 mt-2 w-full">
            {comment.content}
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
                    submit({ comment: comment.id, user: user.id }, { method: "post" }))
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
          
          </div>
          <div className="flex w-1/2 items-center">
         
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-zinc-400" />
              <p className="text-zinc-400 text-lg ml-1">{comment.comments}</p>
          </div>
        </div>
      </div>
    ) : (
      <></>
    );
  }
  