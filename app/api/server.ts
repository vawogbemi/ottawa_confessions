import { createServerClient } from "@supabase/auth-helpers-remix";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import _ from "lodash";

export const POSTS_PER_PAGE = 15;
//(page - 1) * POSTS_PER_PAGE, (page * POSTS_PER_PAGE) - 1

export function AnonServerClient(request: Request) {
  const response = new Response();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  return { supabase, response };
}

export function ServiceServerClient() {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  return supabase;
}

export function validateUsername(username: string) {
  if (!username) {
    return "Username is required.";
  } else if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 13
  ) {
    return `Name must be between 3 characters to 12 long`;
  }
}

export async function fetchTopPosts(
  supabase: SupabaseClient<Database>,
  page: number,
  feed: string
) {
  const { data: topPosts, error: topPostsError } = await supabase
    .from("posts")
    .select()
    .eq("feed", feed)
    .gt(
      "created_at",
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    )
    .order("likes", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (topPostsError) {
    console.log("TOP POSTS ERROR: " + topPostsError);
  }

  return { topPosts };
}

export async function fetchTopPostsWithSearch(
  supabase: SupabaseClient<Database>,
  page: number,
  feed: string,
  query: string
) {
  const formattedQuery = query.split(" ").map(word => `'${word}'`).join(" | ");

  const { data: topPosts, error: topPostsError } = await supabase
    .from("posts")
    .select()
    .eq("feed", feed)
    .gt(
      "created_at",
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    )
    .textSearch("content", formattedQuery)
    .order("likes", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (topPostsError) {
    console.log("TOP POSTS ERROR: " + topPostsError);
  }

  return { topPosts };
}

export async function fetchRecentPosts(
  supabase: SupabaseClient<Database>,
  page: number,
  feed: string
) {
  const { data: recentPosts, error: recentPostsError } = await supabase
    .from("posts")
    .select()
    .eq("feed", feed)
    .order("created_at", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (recentPostsError) {
    console.log(recentPostsError);
  }

  return { recentPosts };
}

export async function fetchRecentPostsWithSearch(
  supabase: SupabaseClient<Database>,
  page: number,
  feed: string,
  query: string
) {
  const formattedQuery = query.split(" ").map(word => `'${word}'`).join(" | ");
  console.log(formattedQuery)
  const { data: recentPosts, error: recentPostsError } = await supabase
    .from("posts")
    .select()
    .eq("feed", feed)
    .textSearch("content", formattedQuery)
    .order("created_at", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (recentPostsError) {
    console.log(recentPostsError);
  }

  return { recentPosts };
}

export async function fetchPosts(
  request: Request,
  page: number,
  feed: string,
  query: string
) {
  const { supabase: anonClient } = AnonServerClient(request);
  const session = await anonClient.auth.getSession();
  const supabase = ServiceServerClient();

  const { topPosts } = query
    ? await fetchTopPostsWithSearch(supabase, page, feed, query)
    : await fetchTopPosts(supabase, page, feed);

  const { recentPosts } = query
    ? await fetchRecentPostsWithSearch(supabase, page, feed, query)
    : await fetchRecentPosts(supabase, page, feed);

  const concatPosts = topPosts?.concat(recentPosts!);

  const uniquePosts = _.uniqBy(concatPosts, (post) => post.id);

  if (session && session.data && session.data.session?.user) {
    const { data: likes } = await supabase
      .from("likes")
      .select("post")
      .eq("user", session.data.session!.user.id)
      .in(
        "post",
        uniquePosts.map((post) => post.id)
      );

    const posts = uniquePosts.map((post) =>
      likes?.find((likedPost) => post.id == likedPost.post)
        ? { post, isLiked: true }
        : { post, isLiked: false }
    );
    return { posts, page };
  }

  const posts = uniquePosts.map((post) => ({ post, isLiked: false }));

  return { posts, page };
}

export async function verifyLike(post: number, user: string) {
  const supabase = ServiceServerClient();

  const { data: like, error: fetchLikeError } = await supabase
    .from("likes")
    .select()
    .eq("post", post)
    .eq("user", user);

  if (fetchLikeError) {
    console.log("FETCH LIKE ERROR: " + fetchLikeError);
  }

  const { data, error: fetchPostError } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", post);

  if (fetchPostError) {
    console.log("FETCH POST ERROR: " + fetchPostError);
  }

  if (like && like.at(0)) {
    //add like to post
    const { error: removelikeError } = await supabase
      .from("likes")
      .delete()
      .eq("post", post)
      .eq("user", user);

    if (removelikeError) {
      console.log("REMOVE LIKE ERROR: " + removelikeError);
    }
    //remove like from post
    if (data && data?.at(0) && typeof data.at(0)?.likes == "number") {
      const likes = data?.at(0)?.likes;

      const { error: likePostError } = await supabase
        .from("posts")
        .update({ likes: likes! - 1 })
        .eq("id", post);

      if (likePostError) {
        console.log("LIKE POST ERROR: " + likePostError);
      }
    }
  } else {
    //add like to table
    const { error: addlikeError } = await supabase
      .from("likes")
      .insert({ post: post, user: user });

    if (addlikeError) {
      console.log("ADD LIKE ERROR: " + addlikeError);
    }
    //add like to post
    if (data && data?.at(0) && typeof data.at(0)?.likes == "number") {
      const likes = data?.at(0)?.likes;

      const { error: likePostError } = await supabase
        .from("posts")
        .update({ likes: likes! + 1 })
        .eq("id", post);

      if (likePostError) {
        console.log("LIKE POST ERROR: " + likePostError);
      }
    }
  }

  return null;
}
