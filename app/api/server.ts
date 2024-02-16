import { createServerClient } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";
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

export async function fetchPosts(request: Request, page: number) {
  const { supabase: anonClient } = AnonServerClient(request);
  const session = await anonClient.auth.getSession();
  const supabase = ServiceServerClient();

  const { data: topPosts, error: topPostsError } = await supabase
    .from("posts")
    .select()
    .gt(
      "created_at",
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    )
    .order("likes", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (topPostsError) {
    console.log(topPostsError);
  }

  const { data: recentPosts, error: recentPostsError } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (recentPostsError) {
    console.log(recentPostsError);
  }

  //console.log(topPosts)
  //console.log(recentPosts)

  const concatPosts = topPosts?.concat(recentPosts!);

  const uniquePosts = _.uniqBy(concatPosts, (post) => post.id);

  if (session && session.data && session.data.session?.user) {
    const { data: likes } = await supabase
      .from("likes")
      .select("post")
      .eq("user", session.data.session!.user)
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
