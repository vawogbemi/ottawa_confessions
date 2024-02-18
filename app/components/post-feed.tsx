import { useEffect, useState } from "react";
import _ from "lodash";
import { FetcherWithComponents, Link } from "@remix-run/react";
import { InfiniteScroller } from "./infinite-scroller";
import { PostView } from "./post-view";

export function PostFeed(props: {
  fetcher: FetcherWithComponents<{
    posts: {
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
      page: number;
    };
  }>;
  posts: {
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
    page: number;
  };
  user: {
    id: string;
    username: string;
    city: string | null;
    school: string | null;
  } | null;
}) {
  const { posts, fetcher, user } = props;

  const [postsData, setPostsData] = useState(posts.posts);

  // An effect for appending data to items state
  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }
    // If we have new data - append it
    if (fetcher.data) {
      const newPosts = fetcher.data.posts.posts;
      setPostsData((prevPosts) =>
        _.uniqBy([...prevPosts, ...newPosts], (post) => post.post.id)
      );
    }
  }, [fetcher.data, fetcher.state]);

  // A method for fetching next page
  const loadNext = () => {
    if (user) {
      const page = fetcher.data ? fetcher.data.posts.page + 1 : posts.page + 1;
      const query = `?index&page=${page}`;
      fetcher.load(query); // this call will trigger the loader with a new query
    }
  };

  return (
    <InfiniteScroller loadNext={loadNext} loading={fetcher.state === "loading"}>
      {postsData && postsData.length > 0 ? (
        <div className="w-full flex flex-wrap">
          {/*Spacing for Site Header */}
          <div className="py-8 w-full"></div>
          <PostView
            posts={user ? postsData : postsData.slice(1, 10)}
            user={user}
          />
                    <div className="py-6 lg:py-0 w-full"></div>
          {!user && (
            <div className="w-full h-screen flex">
              <button className="btn btn-primary mx-auto my-auto" type="button">
                Login to view more
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex-wrap h-screen border-l border-zinc-100 flex">
          <p className="w-full font-bold mx-auto my-auto">No posts yet. Create the first <Link to={"/post/new"} className="text-primary">one.</Link></p>
        </div>
      )}
    </InfiniteScroller>
  );
}
